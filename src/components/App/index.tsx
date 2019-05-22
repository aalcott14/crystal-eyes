import React from 'react';
import NavBar from '../NavBar';
import ImageCapture from '../ImageCapture';

class App extends React.PureComponent {

  handleImageUpload = (img: File) => {
    const fd = new FormData();
    fd.append('image', img);
    fetch('http://localhost:8080/classify', {
      method: 'POST',
      body: fd
    }).then((body) => console.log(body));
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <ImageCapture handleImageUpload={this.handleImageUpload} />
      </React.Fragment>
    );
  }
}

export default App;
