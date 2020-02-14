import newman from 'newman';
import fs from 'fs';
import { promises as file } from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import log from 'loglevel';
log.setDefaultLevel(log.levels.DEBUG);

const optionDefs = [
  { name:'collections', alias: 'c', type: String, defaultOption:true
  /*,multiple:true*/ },
  { name:'environment', alias: 'e', type: String }
]

export const cli = async (args) => {
  try {
    const options = commandLineArgs(optionDefs, args);
    log.debug(options);

    if(!options.collections) throw "Please provide a collection directory.";
    const collections = await file.readdir(options.collections);

    if(options.environment) {
      await file.access(options.environment, fs.constants.F_OK);
    }

    collections.forEach((collection) => {
      const collectionPath = path.join(options.collections, collection)
      newman.run({
        collection: collectionPath,
        reporters: 'cli',
        environment: options.environment
      }, (err) => {
        log.info(`${collectionPath}: ${err ? err.name : 'ok'}!`);
      })
    });
  } 
  catch(e) {
    log.error(e.message);
    log.debug(e);
    return;
  }
}