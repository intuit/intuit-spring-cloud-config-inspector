import default_json from '../sample/publisher/master/default_json.txt';
import qal_json from '../sample/publisher/master/qal_json.txt';
import qal_properties from '../sample/publisher/master/qal_properties.txt';
import qal_yml from '../sample/publisher/master/qal_yml.txt'

const mockData = {
   publisher: {
     master: {
         qal: {
           json: qal_json,
           prop: qal_properties,
           yml: qal_yml
         },
         default: {
           json: default_json
         }
     }
   }
}

export default function getMockData(
  appName='publisher', profiles='qal',
  label='master', ext='json') {
  if (appName in mockData && label in mockData[appName] && profiles in mockData[appName][label]) {
    return mockData[appName][label][profiles][ext]
  } else {
    return null
  }
}
