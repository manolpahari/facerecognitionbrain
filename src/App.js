import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'a2f348159ae44b938c10968df34b3439'
 });


const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1200
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input : '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onRouteChange = (route) => {
    if(route === 'signin') {
      this.setState({ isSignedIn: false })
    }else if(route === 'home') {
      this.setState({ isSignedIn: true})
    }
    this.setState({ route: route })
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: clarifaiFace.left_col * width ,
      topRow: clarifaiFace.top_row * height ,
      rightCol: width - (clarifaiFace.right_col * width) ,
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  
  displayFaceBox = (box) => {
    this.setState({ box: box })
    
  }


  onUserInput = (event) => {
    this.setState({ input: event.target.value });

  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {

    const { imageURL, box, isSignedIn, route} = this.state;

    return (
      <div className="App">
        <Particles className= "particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          
        { route === 'home' ?
          <div> 
            <Logo /> 
            <Rank />
            <ImageLinkForm 
              onUserInput={this.onUserInput}
              onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div> 
          : 
            (  route === 'signin' ?
              <Signin onRouteChange={this.onRouteChange}/> 
              :
              <Register onRouteChange={this.onRouteChange}/> 
            )
        }
        
      </div>
    );
  }
}

export default App;
