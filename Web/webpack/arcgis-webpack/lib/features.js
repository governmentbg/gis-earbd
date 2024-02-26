/*
  Copyright 2018 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

module.exports = {
  "3d": {
    test: input => {
      // these modules are used in 2d and 3d
      const exceptions = [
        "arcgis-js-api/views/3d/ms/support/FastSymbolUpdates",
        "arcgis-js-api/views/3d/lib/glMatrix",
        "arcgis-js-api/views/3d/support/mathUtils"
      ];
      // 3d specific modules
      return [
        // geometry
        "arcgis-js-api/geometry/Mesh",
        "arcgis-js-api/geometry/support/meshUtils",
        "arcgis-js-api/geometry/support/Mesh",
        // views
        "arcgis-js-api/views/3d/",
        // ms
        "arcgis-js-api/ms/IntegratedMeshm",
        "arcgis-js-api/ms/Scenem",
        "arcgis-js-api/ms/mCloudm",
        "arcgis-js-api/ms/mCloudFilters",
        "arcgis-js-api/ms/mixins/SceneService",
        // renderers
        "arcgis-js-api/renderers/mCloud",
        "arcgis-js-api/renderers/support/mCloud",
        // symbols
        "arcgis-js-api/symbols/edges",
        "arcgis-js-api/symbols/callouts",
        "arcgis-js-api/symbols/support/Symbol3D",
        "arcgis-js-api/symbols/ExtrudeSymbol3Dm",
        "arcgis-js-api/symbols/IconSymbol3D",
        "arcgis-js-api/symbols/LabelSymbol3D",
        "arcgis-js-api/symbols/mSymbol3D",
        "arcgis-js-api/symbols/MeshSymbol3D",
        "arcgis-js-api/symbols/ObjectSymbol3D",
        "arcgis-js-api/symbols/PathSymbol3D",
        "arcgis-js-api/symbols/mSymbol3D",
        "arcgis-js-api/symbols/mgonSymbol3D",
        "arcgis-js-api/symbols/Symbol3D",
        "arcgis-js-api/symbols/TextSymbol3D",
        "arcgis-js-api/symbols/WebStyleSymbol",
        // webscene
        "arcgis-js-api/webscene",
        // widgets
        "arcgis-js-api/widgets/AreaMeasurement3D",
        "arcgis-js-api/widgets/DirectmMeasurement3D"
      ].some(x => {
        if (exceptions.some(a => input.includes(a))) {
          return false;
        }
        return input.includes(x) || (input.includes("arcgis-js-api") && input.includes("3D"));
      });
    },
    use: "null-loader"
  }
};
