import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //@TODO1 SOLUTION
  app.get('/filteredimage',async(request,response)=>{

    //parsing the parameter recived from the query sent
    let { image_url} = request.query;
    
    if(image_url.length === 0){
      return response.status(422).send('Empity URL observed!');
    }
       
    else{

      image_url = image_url.toString();
      let imageFilterPath : string = '';
  
    
    try{
      //Checking weather the provided protocol and extension is valid or not

     const invalidProtocol = (image_url.match(/\.(jpeg|jpg|gif|png)$/) != null);
      if(!invalidProtocol)
      return response.status(422).send('Invalid URL or image extension');

      imageFilterPath = await filterImageFromURL(image_url);
      response.status(200).sendFile(imageFilterPath);
      setTimeout(() => deleteLocalFiles([imageFilterPath]),1000);

    }
    catch (e){
      console.log(e);
      response.status(500).send('Server Error or the requested image url removed for some reason');
    } 
  }
  })
  //! END TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
