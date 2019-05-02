const tf = require('@tensorflow/tfjs')
const path = require('path');
require('@tensorflow/tfjs-node')

const modelPath = path.join(__dirname, './ts_files/tensorflowjs_model.pb');
const NUMBER_OF_CHANNELS = 3

const imageByteArray = (image, numChannels) => {
  const pixels = image.data
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

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
  const input = tf.tensor3d(values, outShape, 'int32');

  return input
}

const loadModel = async () => {
  return await tf.loadGraphModel(`file://${modelPath}`);
}

module.exports = async (img) => {
  try {
    const input = imageToInput(img, NUMBER_OF_CHANNELS)
    const inception_model = await loadModel();
    const predictions = await inception_model.predict(input);
  
    console.log('classification results:', predictions)
  } catch(e) {
    console.log('ERROR', e);
  }
}