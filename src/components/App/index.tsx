import React from 'react';

class App extends React.Component {

  handleImageUpload = (event: any) => {
    const fd = new FormData();
    fd.append('image', event.target.files[0]);
    fetch('http://localhost:8080/classify', {
      method: 'POST',
      body: fd
    }).then((body) => console.log(body));
  }

  render() {
    return (
      <input type="file" onChange={this.handleImageUpload} />
    );
  }
}

export default App;
