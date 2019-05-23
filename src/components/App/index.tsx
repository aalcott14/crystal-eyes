import React from 'react';
import NavBar from '../NavBar';
import ImageCapture from '../ImageCapture';

interface IState {
  isAnalyzing: boolean;
  prediction: string;
}

interface Prediction {
  label: string;
  value: string;
}

class App extends React.PureComponent<{}, IState> {

  state: IState = {
    isAnalyzing: false,
    prediction: null
  }

  pickPrediction = (results: Prediction[]) => {
    const prediction = results[0].label;
    this.setState({ prediction });
  }

  handleImageUpload = (img: File) => {
    const fd = new FormData();
    fd.append('image', img);
    fetch('http://localhost:8080/classify', {
      method: 'POST',
      body: fd
    }).then((resp) => resp.body.getReader().read().then((body) => {
      const predictions = new TextDecoder("utf-8").decode(body.value);
      this.pickPrediction(JSON.parse(predictions));
    }));
  }

  render() {
    const { isAnalyzing, prediction } = this.state;
    return (
      <React.Fragment>
        <NavBar />
        <ImageCapture 
          handleImageUpload={this.handleImageUpload}
          isAnalyzing={isAnalyzing}  
        />
        {prediction && (
          <div className="mt-4 d-flex">
            <h4 className="ml-auto mr-auto">
              {prediction.toUpperCase()}
            </h4>
        </div>)}
      </React.Fragment>
    );
  }
}

export default App;
