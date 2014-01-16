Proj4js.defs["EPSG:25833"] = "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs";

var url = "http://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer";

var layerInfo = {
    "currentVersion": 10.11,
    "serviceDescription": "",
    "mapName": "Layers",
    "description": "",
    "copyrightText": "",
    "supportsDynamicLayers": false,
    "layers": [
    {
        "id": 0,
        "name": "GeocacheTrafikk",
        "parentLayerId": -1,
        "defaultVisibility": false,
        "subLayerIds": null,
        "minScale": 0,
        "maxScale": 0
    }
    ],
        "tables": [],
        "spatialReference": {
            "wkid": 25833,
            "latestWkid": 25833
        },
        "singleFusedMapCache": true,
        "tileInfo": {
            "rows": 256,
            "cols": 256,
            "dpi": 96,
            "format": "PNG24",
            "compressionQuality": 90,
            "origin": {
                "x": -2500000,
                "y": 9045984
            },
            "spatialReference": {
                "wkid": 25833,
                "latestWkid": 25833,
                "vcsWkid": 5776,
                "latestVcsWkid": 5776
            },
            "lods": [
            {
                "level": 0,
                "resolution": 21674.7100160867,
                "scale": 81920000
            },
            {
                "level": 1,
                "resolution": 10837.35500804335,
                "scale": 40960000
            },
            {
                "level": 2,
                "resolution": 5418.677504021675,
                "scale": 20480000
            },
            {
                "level": 3,
                "resolution": 2709.3387520108377,
                "scale": 10240000
            },
            {
                "level": 4,
                "resolution": 1354.6693760054188,
                "scale": 5120000
            },
            {
                "level": 5,
                "resolution": 677.3346880027094,
                "scale": 2560000
            },
            {
                "level": 6,
                "resolution": 338.6673440013547,
                "scale": 1280000
            },
            {
                "level": 7,
                "resolution": 169.33367200067735,
                "scale": 640000
            },
            {
                "level": 8,
                "resolution": 84.66683600033868,
                "scale": 320000
            },
            {
                "level": 9,
                "resolution": 42.33341800016934,
                "scale": 160000
            },
            {
                "level": 10,
                "resolution": 21.16670900008467,
                "scale": 80000
            },
            {
                "level": 11,
                "resolution": 10.583354500042335,
                "scale": 40000
            },
            {
                "level": 12,
                "resolution": 5.291677250021167,
                "scale": 20000
            },
            {
                "level": 13,
                "resolution": 2.6458386250105836,
                "scale": 10000
            },
            {
                "level": 14,
                "resolution": 1.3229193125052918,
                "scale": 5000
            },
            {
                "level": 15,
                "resolution": 0.6614596562526459,
                "scale": 2500
            },
            {
                "level": 16,
                "resolution": 0.33072982812632296,
                "scale": 1250
            }
            ]
        },
        "initialExtent": {
            "xmin": -1477295.3769466938,
            "ymin": 7169194.909285694,
            "xmax": 2180311.938267937,
            "ymax": 8584425.975041945,
            "spatialReference": {
                "wkid": 25833,
                "latestWkid": 25833
            }
        },
        "fullExtent": {
            "xmin": -3708422.027686313,
            "ymin": 3479849.9390679616,
            "xmax": 4766389.588603588,
            "ymax": 1.0155660624022666E7,
            "spatialReference": {
                "wkid": 25833,
                "latestWkid": 25833
            }
        },
        "minScale": 81920000,
        "maxScale": 1250,
        "units": "esriMeters",
        "supportedImageFormatTypes": "PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP",
        "documentInfo": {
            "Title": "Demo",
            "Author": "eriku",
            "Comments": "",
            "Subject": "",
            "Category": "",
            "AntialiasingMode": "Fast",
            "TextAntialiasingMode": "Force",
            "Keywords": ""
        },
        "capabilities": "Map",
        "supportedQueryFormats": "JSON, AMF",
        "maxRecordCount": 1000,
        "maxImageHeight": 2048,
        "maxImageWidth": 2048
};

var wgs1984 = new OpenLayers.Projection("EPSG:4326");

var svvMap = function(options) {
    var layerMaxExtent = new OpenLayers.Bounds(-300000, 6200000, 1300000, 8200000);

    var controls = [
        new OpenLayers.Control.Navigation(),
        // only show scale line in meters
        new OpenLayers.Control.ScaleLine({ bottomOutUnits: '' }),
        new OpenLayers.Control.Zoom()
     ];

    var arcgis = new OpenLayers.Layer.ArcGISCache("GeocacheTrafikk", url, {
        layerInfo: layerInfo
    });

    var map = new OpenLayers.Map({
        // we restrict the map to only include Norway
        restrictedExtent: layerMaxExtent,
        // reset the theme, as we want to specify everything ourselves
        theme: null,
        controls: controls,
        units: arcgis.units,
        resolutions: arcgis.resolutions,
        tileSize: arcgis.tileSize,
        layers: [arcgis],
        isValidZoomLevel: function(zoomLevel) {
            // A zoomLevel of 3 is the lowest zoom where roads are marked on the map
            return zoomLevel >= 3 && zoomLevel < this.getNumZoomLevels();
        }
    });

    return map;
};

function createCurrentPositionLayer(map) {
    var template = {
        externalGraphic: "${icon}",
        graphicHeight: 20,
        graphicWidth: 20
    };
    var context = {
        icon: function(feature) {
            var zoom = map.getZoom();
            return 'bower_components/openlayers/theme/default/img/overview_replacement.gif';
        }
    };
    var currentPositionStyle = new OpenLayers.Style(template, { context: context });

    return new OpenLayers.Layer.Vector("currentPosition", {
        styleMap: new OpenLayers.StyleMap({
            default: currentPositionStyle
        })
    });
}

var stationIconSize = _.memoize(function(zoomLevel) {
    if (zoomLevel > 10) {
        return { width: 32, height: 42 };
    }
    return { width: 16, height: 21 };
});

function createStationsLayer(map) {
    var Filter = {};
    Filter.Clustered = OpenLayers.Class(OpenLayers.Filter, {
        isClustered: null,

        initialize: function(options) {
            OpenLayers.Filter.prototype.initialize.apply(this, [options]);
            this.isClustered = options.isClustered;
        },

        evaluate: function(context) {
            if (context.hasOwnProperty('count')) {
                return context.count > 1 && this.isClustered;
            }

            return !this.isClustered;
        }
    });
    Filter.Installable = OpenLayers.Class(OpenLayers.Filter, {
        initialize: function(options) {
            OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        },

        evaluate: function(context) {
            return context.hasOwnProperty('station') && context.station.install;
        }
    });
    Filter.Uninstallable = OpenLayers.Class(OpenLayers.Filter, {
        initialize: function(options) {
            OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        },

        evaluate: function(context) {
            return context.hasOwnProperty('station') && !context.station.install;
        }
    });

    var isClustered = new Filter.Clustered({ isClustered: true });
    var notClustered = new Filter.Clustered({ isClustered: false });
    var installableFilter = new Filter.Installable();
    var uninstallableFilter = new Filter.Uninstallable();

    var installable = new OpenLayers.Filter.Logical({
        type: OpenLayers.Filter.Logical.AND,
        filters: [notClustered, installableFilter]
    });
    var uninstallable = new OpenLayers.Filter.Logical({
        type: OpenLayers.Filter.Logical.AND,
        filters: [notClustered, uninstallableFilter]
    });

    var baseImgPath = 'bower_components/openlayers/img/';

    var rules = [
        new OpenLayers.Rule({
            filter: isClustered,
            symbolizer: {
                label: "${count}",
                fill: true,
                fillColor: "#444f55",
                fillOpacity: 1,
                fontColor: "#fff",
                fontSize: 14,
                pointRadius: 15,
                stroke: false
            }
        }),
        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: {
                fill: true,
                fillColor: "#fff",
                fillOpacity: 1,
                stroke: true,
                strokeColor: "#444f55",
                strokeOpacity: 1,
                strokeWidth: 1,
                pointRadius: 4
            },
            minScaleDenominator: 500000
        }),
        new OpenLayers.Rule({
            filter: installable,
            symbolizer: {
                fill: true,
                fillColor: "#58b02c",
                fillOpacity: 1,
                stroke: true,
                strokeColor: "#444f55",
                strokeOpacity: 1,
                strokeWidth: 1,
                pointRadius: 4
            },
            minScaleDenominator: 500000
        }),
        new OpenLayers.Rule({
            filter: installable,
            symbolizer: {
                externalGraphic: baseImgPath + 'marker-blue.png',
                graphicHeight: 21,
                graphicWidth: 16,
                graphicOpacity: 1
            },
            minScaleDenominator: 300000,
            maxScaleDenominator: 500000
        }),
        new OpenLayers.Rule({
            filter: installable,
            symbolizer: {
                externalGraphic: baseImgPath + 'marker-gold.png',
                graphicHeight: 21,
                graphicWidth: 16,
                graphicOpacity: 1
            },
            maxScaleDenominator: 300000
        }),
        new OpenLayers.Rule({
            elseFilter: true,
            symbolizer: {
                externalGraphic: baseImgPath + 'marker.png',
                graphicHeight: 21,
                graphicWidth: 16,
                graphicOpacity: 1
            }
        })
    ]
    var style = new OpenLayers.Style({}, { rules: rules });

    var defaultThreshold = 2;
    var noClusteringThreshold = 100000;
    var noClusteringZoomLevel = 10;
    var clusterStrategy = new OpenLayers.Strategy.Cluster({ distance: 35, threshold: defaultThreshold });

    var stationsLayer = new OpenLayers.Layer.Vector("stations", {
        styleMap: new OpenLayers.StyleMap(style),
        // strategies: [clusterStrategy]
    });

    function recluster(clusterStrategy) {
        clusterStrategy.clusters = null;
        clusterStrategy.cluster();
        clusterStrategy.layer.refresh({ force: true });
    }

    function containsClusters(clusterStrategy) {
        if (clusterStrategy.clusters && clusterStrategy.features) {
            return clusterStrategy.clusters.length !== clusterStrategy.features.length;
        }
        return false;
    }

    function ensureNoClusteringBelowZoomLevel() {
        console.log(map.getZoom(), map.getScale());
        var clusterStrategy = stationsLayer.strategies[0];

        if (map.getZoom() >= noClusteringZoomLevel) {
            if (clusterStrategy.threshold === defaultThreshold && containsClusters(clusterStrategy)) {
                clusterStrategy.threshold = noClusteringThreshold;
                recluster(clusterStrategy);
            }
        } else {
            if (clusterStrategy.threshold !== defaultThreshold && !containsClusters(clusterStrategy)) {
                clusterStrategy.threshold = defaultThreshold;
                recluster(clusterStrategy);
            }
        }
    }

    // map.events.register("zoomend", this, ensureNoClusteringBelowZoomLevel);

    var stationsControl = new OpenLayers.Control.SelectFeature(stationsLayer, {
        onSelect: function(feature) {
            if (feature.cluster) return;
            var station = feature.data.station;

            var popup = new OpenLayers.Popup(
                'svv-popup-' + station.id,
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(150, 50),
                "<h3>" + station.stationName + "</h3>",
                false,
                null);

            feature.popup = popup;
            map.addPopup(popup);
        },
        onUnselect: function(feature) {
            if (feature.cluster) return;
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        }
    });
    map.addControl(stationsControl);
    stationsControl.activate();

    return stationsLayer;
}

function datainnMap() {
    var map = svvMap();

    map.addLayer(createCurrentPositionLayer(map));
    map.addLayer(createStationsLayer(map));

    function start(currentPosition) {
        map.setCenter(new OpenLayers.LonLat(333992, 7196536), 3)
    }

    function goToCurrentPosition() {
        var layer = map.getLayersByName("currentPosition")[0];
        var features = layer.getFeaturesByAttribute('id', 'currentPosition')
        if (features.length > 0) {
            var position = features[0].geometry;
            var lonLat = new OpenLayers.LonLat(position.x, position.y);
            map.setCenter(lonLat, 13);
        }
    }

    function setCurrentPosition(lon, lat) {
        var layer = map.getLayersByName("currentPosition")[0];
        var features = layer.getFeaturesByAttribute('id', 'currentPosition')

        if (features.length > 0) {
            var lonlat = new OpenLayers.LonLat(lon, lat).transform(
                wgs1984,
                map.getProjectionObject()
            );

            features[0].move(lonlat);
        } else {
            var point = new OpenLayers.Geometry.Point(lon, lat).transform(
                wgs1984,
                map.getProjectionObject()
            );

            var feature = new OpenLayers.Feature.Vector(point, { id: 'currentPosition' });
            layer.addFeatures(feature);
        }
    }

    function showStations(stations) {
        var layer = map.getLayersByName("stations")[0];

        layer.removeAllFeatures();

        var features = stations.map(getFeatureForStation);
        layer.addFeatures(features);
    }

    function getFeatureForStation(station) {
        return new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(station.coordinateEast, station.coordinateNorth), { station: station }
        );
    }

    function render(el) {
        map.render(el);
    }

    // map.addControl(new OpenLayers.Control.MousePosition());
    // map.events.on({
    //     "moveend":function(){
    //         console.log(map.getCenter().toString())
    //     }
    // });

    start();

    return {
        render: render,
        showStations: showStations,
        setCurrentPosition: setCurrentPosition,
        goToCurrentPosition: goToCurrentPosition
    }
}

window.onload = function() {
    var map = datainnMap();

    map.render(document.querySelector('#map'));

    map.setCurrentPosition(10.4009966, 63.4112076);
    // map.goToCurrentPosition();

    $.getJSON("/stations").done(function(stations) {
            console.log(stations);
        map.showStations(stations);
        }, function() {
        console.log('failed');
        });

    // TODO:
    // - notified when map is moved and we are closer than a certain zoom level
    // - boundingBox()
}
