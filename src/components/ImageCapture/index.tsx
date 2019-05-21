import React from 'react';

interface IProps {
  handleImageUpload: (e: any) => void;
}

class ImageCapture extends React.Component<IProps, {}> {

  render() {
    return (
      <div className="d-flex mt-4">
        <input type="file" onChange={this.props.handleImageUpload} />
      </div>
    )
  }
}

export default ImageCapture;