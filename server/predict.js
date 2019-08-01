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
const INPUT_WIDTH = 299;
const INPUT_HEIGHT = 299;
const INPUT_MEAN = 0;
const INPUT_STD = 255;

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

module.exports = async (img, res) => {
  try {
    const inception_model = await loadModel();
    canvas.loadImage(img).then((canvasImage) => {
      const can = canvas.createCanvas(INPUT_WIDTH, INPUT_HEIGHT);
      const ctx = can.getContext('2d');
      ctx.drawImage(canvasImage, 0, 0, INPUT_WIDTH, INPUT_HEIGHT);
      const tensor = tf.browser.fromPixels(can, 3).toFloat();
      const etensor = tensor.expandDims(0);
      const resized = tf.image.resizeBilinear(etensor, [INPUT_WIDTH, INPUT_HEIGHT]);
      const normalized = tfc.div(tfc.sub(resized, [INPUT_MEAN]), [INPUT_STD]);
      const prediction = inception_model.execute(normalized);
      const predictionList = getTopKClasses(prediction, 6);
      console.log('classification results:', predictionList);
  
      res.send(JSON.stringify(predictionList));
    })
  } catch(e) {
    console.log('ERROR', e);
  }
}