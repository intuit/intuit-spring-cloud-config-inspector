import default_json from '../sample/publisher/master/default_json.txt';
import qal_json from '../sample/publisher/master/qal_json.txt';
import qal_properties from '../sample/publisher/master/qal_properties.txt';
import qal_yml from '../sample/publisher/master/qal_yml.txt'

const mockData = {
   publisher: {
     master: {
         qal: {
           json: qal_json,
           properties: qal_properties,
           yaml: qal_yml
         },
         default: {
           json: default_json
         }
     }
   }
}

/**
 * Returns contents of mock config files
 *
 * @param {string} appName - app name
 * @param {string} profiles - profiles separated by commas
 * @param {string} label - branch/tag
 * @param {string} ext - extension (json, yaml, properties)
 * @returns {(string|null)} code or null if not found
 */
export default function getMockData(appName, profiles, label, ext='json') {
  if (appName in mockData && label in mockData[appName] && profiles in mockData[appName][label]) {
    return mockData[appName][label][profiles][ext]
  } else {
    return null
  }
}
