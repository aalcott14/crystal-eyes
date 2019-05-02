import React from 'react';

// MUST BE PNG
// const getBase64 = (file: any, cb: any) => {
//   let reader: any = new FileReader();
//   reader.onload = function () {
//     cb(reader.result)
//   };
//   reader.onerror = function (error: any) {
//       console.log('Error: ', error);
//   };
//   reader.readAsDataURL(file);
// }

class App extends React.Component {

  handleImageUpload = (event: any) => {
    console.log('event', event);
    const fd = new FormData();
    fd.append('image', event.target.files[0]);
    fetch('http://localhost:8080/classify', {
      method: 'POST',
      body: fd
    }).then((response) => response.text()).then((body) => console.log(body));
  }

  render() {
    return (
      <input type="file" onChange={this.handleImageUpload} />
    );
  }
}

export default App;
