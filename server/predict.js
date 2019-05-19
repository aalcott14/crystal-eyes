const tf = require('@tensorflow/tfjs')
const { loadFrozenModel } = require('@tensorflow/tfjs-converter');
const tfc = require('@tensorflow/tfjs-core');
const fs = require('fs');
const path = require('path');
global.fetch = require('node-fetch');
const canvas = require('canvas');
require('@tensorflow/tfjs-node')

const modelPath = './server/mobilenet/tensorflowjs_model.pb';
const weightsPath = './server/mobilenet/weights_manifest.json';

const loadModel = async () => {
  return await loadFrozenModel(`file://${modelPath}`, `file://${weightsPath}`);
}

const getTopKClasses = (logits, topK) => {
  const predictions = tf.tidy(() => {
    return tf.softmax(logits);
  });

  const values = predictions.dataSync();
  predictions.dispose();

  let predictionList = [];
  for (let i = 0; i < values.length; i++) {
    predictionList.push({value: values[i], index: i});
  }
  predictionList = predictionList.sort((a, b) => {
    return b.value - a.value;
  }).slice(0, topK);

  const labels = fs.readFileSync(path.join(__dirname, './mobilenet/output_labels.txt')).toString().split('\n');

  return predictionList.map(x => {
    return {label: labels[x.index], value: x.value};
  });
}

module.exports = async (img) => {
  try {
    const inception_model = await loadModel();
    canvas.loadImage(img).then((canvasImage) => {
      const can = canvas.createCanvas(299, 299);
      const ctx = can.getContext('2d');
      ctx.drawImage(canvasImage, 0, 0, 299, 299);
      const tensor = tf.browser.fromPixels(can);
      const casted = tfc.cast(tensor, 'float32');
      const etensor = casted.expandDims(0);
      const resized = tf.image.resizeBilinear(etensor, [299, 299]);
      const normalized = tfc.div(tfc.sub(resized, [0]), [255]);
      const prediction = inception_model.execute(normalized);
      const predictionList = getTopKClasses(prediction, 6);
      console.log('classification results:', predictionList);
  
      return predictionList;
    })
  } catch(e) {
    console.log('ERROR', e);
  }
}