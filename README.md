# Installation Guide

- Create an empty folder and extract the the zipped files and folder in it.
- open an terminal in that folder (either CMD or vsCode terminal)
- run the following command

  ```
  npm i --legacy-peer-deps
  ```

## To run the project :

1. run the below command in the terminal

   ```
   npm start
   ```

   # Ignore the below Steps \*

## Steps

1. installing dependencies

```
 npm i @tensorflow/tfjs @tensorflow-models/handpose
 npm i react-webcam
 npm i fingerpose
```

2. Developing landing page in App.js.
3. Importing these dependencies in VideoStream.js for later use.
4. Setting up webcam and canvas in VideoStream.js.
5. Now making the function handpose to run detectHand function at interval of 100 ms.
6. In detectHand function we are detecting hand with the following function `estimateHands()`.
7. Now for drawing dots and line on canvas we making an new file `utils.js` in src folder.
8. So in `utils.js` we are looping through every predictions and then looping through every landmark which is basically a point having proerties like (x,y,z).
9. Updating detect function for gesture handling.
10. Setup of hook and emoji object.
11. Adding emoji display to the screen.
