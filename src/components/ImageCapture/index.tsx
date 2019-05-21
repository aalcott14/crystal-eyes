import React from 'react';

interface IProps {
  handleImageUpload: (e: any) => void;
}

class ImageCapture extends React.Component<IProps, {}> {

  render() {
    return (
      <input className='mt-4' type="file" onChange={this.props.handleImageUpload} />
    )
  }
}

export default ImageCapture;