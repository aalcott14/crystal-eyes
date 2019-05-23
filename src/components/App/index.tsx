import React from 'react';
import NavBar from '../NavBar';
import ImageCapture from '../ImageCapture';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

interface IState {
  isAnalyzing: boolean;
  prediction: Prediction;
}

interface Prediction {
  label: string;
  value: number;
}

class App extends React.PureComponent<{}, IState> {

  state: IState = {
    isAnalyzing: false,
    prediction: null
  }

  pickPrediction = (results: Prediction[]) => {
    const prediction = results[0];
    this.setState({ 
      prediction,
      isAnalyzing: false
    });
  }

  handleImageUpload = (img: File) => {
    this.setState({ isAnalyzing: true })
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
      <div className="d-flex flex-column">
        <NavBar />
        <ImageCapture 
          handleImageUpload={this.handleImageUpload}
          isAnalyzing={isAnalyzing}  
        />
        {isAnalyzing ? (
          <CircularProgress 
            size="50%"
            className="ml-auto mr-auto"
            color="secondary"
          />
        ) : prediction && (
          <div className="mt-4 d-flex flex-column justify-content-center">
            <Typography 
              variant="h6"
              color="textSecondary"
              className="ml-auto mr-auto"
            >
              Result:
            </Typography>
            <h4 className="ml-auto mr-auto">
              {`${prediction.label.toUpperCase()} (${(prediction.value * 100).toString().slice(0,2)}%)`}
            </h4>
        </div>)}
      </div>
    );
  }
}

export default App;
