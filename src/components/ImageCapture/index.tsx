import React, { ChangeEvent } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@material-ui/core';

const urltoFile = (url: string, filename: string, mimeType: string) => {
  return (fetch(url)
    .then(function(res){return res.arrayBuffer();})
    .then(function(buf){return new File([buf], filename, {type:mimeType});})
  );
}


interface IProps {
  handleImageUpload: (img: File) => void;
}

interface IState {
  screenshot: string;
}

class ImageCapture extends React.Component<IProps, IState> {
  webcam: Webcam = null;

  state: IState = {
    screenshot: null
  }

  handleClick = async () => {
    const screenshot = this.webcam.getScreenshot();
    const file = await urltoFile(screenshot, 'crystal.png', 'image/png')
    this.setState({ screenshot });
    this.props.handleImageUpload(file);
  }
  
  render() {
    return (
      <div className="d-flex mt-4 flex-column ml-auto mr-auto">
        <Webcam
          className="ml-auto mr-auto"
          height={350}
          width={350}
          audio={false}
          ref={node => this.webcam = node}
          screenshotFormat="image/png"
        />
        <Button 
          className="mr-auto ml-auto"
          style={{width: 350}}
          variant="contained"
          color="secondary"
          onClick={this.handleClick}
        >
          Capture
        </Button>
        <div className="mt-2 ml-auto mr-auto">
          or
        </div>
        <input 
          className="mt-2 ml-auto mr-auto text-align-center"
          type="file" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.handleImageUpload(e.target.files[0])}
        />
      </div>
    )
  }
}

export default ImageCapture;