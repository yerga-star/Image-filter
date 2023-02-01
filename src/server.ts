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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  //@TODO1 SOLUTION
  app.get('/filteredimage',async(request,response)=>{
    //parsing the parameter recived from the query
    let { image_url} = requset.query;
    
    if(!image_url)
       return res.status(422).send('Invalid parameter observed!');
    
    image_url = image_url.toString();
    let filteredPath : string = '';

    try{
      //Checking weather the provided protocol is valid
      //or not
      const invalidProtocol = (image_url.slice(0,4) !== 'http' && image_url.slice(0,5) !== 'https') 
      ||  image_url.slice(-3) !== 'jpg';

      if(invalidProtocol)
      return res.status(422).send('Invalid image etension or url');
      filteredPath = await filterImageFromURL(image_url);
      res.status(200).sendFile(filteredPath);
      setTimeout(() => deleteLocalFiles([filteredPath]),1000);

    }
    catch (error){
      console.log(error);
      res.status(500).send('Server Error or the requested image url removed for some reason');
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
