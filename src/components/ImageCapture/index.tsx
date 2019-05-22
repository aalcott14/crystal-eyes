import React, { ChangeEvent } from 'react';

interface IProps {
  handleImageUpload: (img: File) => void;
}

class ImageCapture extends React.Component<IProps, {}> {
  render() {
    return (
      <div className="d-flex mt-4 flex-column justify-content-center">
        <input type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.handleImageUpload(e.target.files[0])} />
      </div>
    )
  }
}

export default ImageCapture;