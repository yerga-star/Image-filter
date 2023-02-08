import express,{Request,Response} from 'express';
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
  app.get('/filteredimage',async(req: Request, res: Response)=>{

    //parsing the parameter recived from the query sent and 
    //it automatically sets the variable type to string 
    //to see that you can hover on the variable, 
    //with the help of QueryString.ParsedQs | string[] | QueryString.ParsedQs[] 
    
    let {image_url} : {image_url:string}= req.query as any;
    
    if(image_url.length === 0){
      return res.status(422).send('Empity URL observed!');
    }
       
    else{

      image_url = image_url.toString();
      let imageFilterPath : string = '';
  
    
    try{
      //Checking weather the provided protocol and extension is valid or not

     const invalidProtocol: string|boolean = (image_url.match(/\.(jpeg|jpg|gif|png)$/) != null);
      if(!invalidProtocol)
      return res.status(422).send('Invalid URL or image extension');

      imageFilterPath = await filterImageFromURL(image_url);
      res.status(200).sendFile(imageFilterPath);
      setTimeout(() => deleteLocalFiles([imageFilterPath]),1000);

    }
    catch (e){
      console.log(e);
      res.status(500).send('Server Error or the requested image url removed for some reason');
    } 
  }
  })
  //! END TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("Please try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
