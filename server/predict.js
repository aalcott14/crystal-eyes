const tf = require('@tensorflow/tfjs')
const { loadFrozenModel } = require('@tensorflow/tfjs-converter');
const tfc = require('@tensorflow/tfjs-core');
global.fetch = require('node-fetch');
const canvas = require('canvas');
require('@tensorflow/tfjs-node')

const modelPath = './server/ts_files/tensorflowjs_model.pb';
const weightsPath = './server/ts_files/weights_manifest.json';
const NUMBER_OF_CHANNELS = 3

const imageByteArray = (image, numChannels) => {
  const pixels = image.data
  const numPixels = image.width * image.height;
  const values = new Float32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values
}

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels)
  const outShape = [image.height, image.width, numChannels];
  const input = tf.tensor3d(values, outShape, 'float32');

  return input
}

const loadModel = async () => {
  return await loadFrozenModel(`file://${modelPath}`, `file://${weightsPath}`);
}

module.exports = async (img) => {
  try {
    // const input = imageToInput(img, NUMBER_OF_CHANNELS)
    const inception_model = await loadModel();
    canvas.loadImage(img).then((canvasImage) => {
      const can = canvas.createCanvas(299, 299);
      const ctx = can.getContext('2d');
      // const array = new Uint8ClampedArray(img);
      ctx.drawImage(canvasImage, 0, 0, 299, 299);
      console.log(can);
      const tensor = tf.browser.fromPixels(can);
      const etensor = tensor.expandDims(0);
      const casted = tfc.cast(etensor, 'float32');
      const predictionList = inception_model.predict(casted).dataSync();
      console.log('classification results:', predictionList;
  
      return predictionList;
    })

    
    // const modifiedInput = {
    //   ...input,
    //   shape: [-1, ...input.shape],
    // }
    // input.shape = [-1, ...input.shape];
    // const predictions = await inception_model.predict(modifiedInput);
    // const preprocessedInput = tfc.div(
    //   tfc.sub(input.asType('float32'), PREPROCESS_DIVISOR),
    //   PREPROCESS_DIVISOR);
    // const reshapedInput =
    //     input.reshape([-1, ...input.shape]);
    // // const dict = {};
    // // dict[INPUT_NODE_NAME] = reshapedInput;
    // const predictions = inception_model.predict(reshapedInput).dataSync();
    // let predictionList = [];
    // for (let i = 0; i < predictions.length; i++) {
    //   predictionList.push({value: predictions[i], index: i});
    // }
    // predictionList = predictionList.sort((a, b) => {
    //   return b.value - a.value;
    // });
  
  } catch(e) {
    console.log('ERROR', e);
  }
}