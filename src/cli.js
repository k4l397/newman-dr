import newman from 'newman';
import fs from 'fs';
import { promises as file } from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import log from 'loglevel';
log.setDefaultLevel(
  process.env.NODE_ENV === 'dev' ?
   log.levels.DEBUG : log.levels.WARN
);

const optionDefs = [
  { name:'collections', alias: 'c', type: String, defaultOption:true
  /*,multiple:true*/ },
  { name:'environment', alias: 'e', type: String }
]

const parseOptions = (args) => {
  return commandLineArgs(
    optionDefs,
    args.map(arg => arg.replace('"', ''))
  )
}

// checks if file / dir exists
const validateOptions = (options) => {
  const obj = Object.values(options).map(val => file.access(val, fs.constants.F_OK));
  return obj
}

export const cli = async (args) => {
  try {
    const options = parseOptions(args);
    log.debug(options);

    Promise.all(validateOptions(options)).then(
      () => log.debug("Options are valid.")
    ).catch(
      (err) => log.error(err)
    );

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