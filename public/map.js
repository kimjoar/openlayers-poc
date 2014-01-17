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
var currentPositionLayerName = "currentPosition";

function createCurrentPositionLayer(map) {
    var template = {
        pointRadius: "${size}",

        fill: true,
        fillColor: "#0185b6",
        fillOpacity: "${fillOpacity}",

        stroke: true,
        strokeColor: "${strokeColor}",
        strokeOpacity: 1,
        strokeWidth: 1
    };
    var context = {
        size: function(feature) {
            var layer = feature.layer;
            var resolution = layer.map.getResolution();
            var accuracy = layer.position.accuracy;

            return Math.max(5, Math.ceil(accuracy / resolution));
        },
        fillOpacity: function(feature) {
            var map = feature.layer.map;

            if (map.getZoom() > 10) return 0.5;
            else return 1;
        },
        strokeColor: function(feature) {
            var map = feature.layer.map;

            if (map.getZoom() > 10) return "#008ec2";
            else return "#444f55";
        }
    };
    var currentPositionStyle = new OpenLayers.Style(template, { context: context });

    return new OpenLayers.Layer.Vector(currentPositionLayerName, {
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
            if (!context.hasOwnProperty('station')) return false;
            return !!context.station.install;
        }
    });
    Filter.Uninstallable = OpenLayers.Class(OpenLayers.Filter, {
        initialize: function(options) {
            OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        },

        evaluate: function(context) {
            if (!context.hasOwnProperty('station')) return false;
            return !context.station.install;
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

    function basedOn(baseSettings) {
        var builder = function(specifics) {
            return _.extend({}, baseSettings, specifics || {});
        }

        builder.with = function(specifics) {
            return basedOn(_.extend({}, baseSettings, specifics || {}));
        };

        return builder;
    }

    var settings = basedOn({
        pointRadius: 2,

        fill: true,
        fillColor: "#58b02c",
        fillOpacity: 1,

        stroke: true,
        strokeColor: "#444f55",
        strokeOpacity: 1,
        strokeWidth: 1
    });

    var alarmSettings = settings.with({ fillColor: "red" });

    var clusterSettings = basedOn({
        label: "${count}",
        fontColor: "#fff",
        fontSize: 14,

        pointRadius: 15,

        fill: true,
        fillColor: "#444f55",
        fillOpacity: 1,

        stroke: false
    });

    var rules = [
        new OpenLayers.Rule({
            filter: isClustered,
            symbolizer: clusterSettings()
        }),

        new OpenLayers.Rule({
            filter: installable,
            symbolizer: settings(),
            minScaleDenominator: 2000000
        }),

        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: alarmSettings(),
            minScaleDenominator: 2000000
        }),

        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: alarmSettings({ pointRadius: 4 }),
            minScaleDenominator: 400000,
            maxScaleDenominator: 2000000
        }),

        new OpenLayers.Rule({
            filter: installable,
            symbolizer: settings({ pointRadius: 4 }),
            minScaleDenominator: 400000,
            maxScaleDenominator: 2000000
        }),

        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: alarmSettings({ pointRadius: 5, strokeWidth: 2 }),
            minScaleDenominator: 100000,
            maxScaleDenominator: 400000
        }),

        new OpenLayers.Rule({
            filter: installable,
            symbolizer: settings({ pointRadius: 5, strokeWidth: 2 }),
            minScaleDenominator: 100000,
            maxScaleDenominator: 400000
        }),

        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: alarmSettings({ pointRadius: 8, strokeWidth: 7 }),
            minScaleDenominator: 5000,
            maxScaleDenominator: 100000
        }),

        new OpenLayers.Rule({
            filter: installable,
            symbolizer: settings({ pointRadius: 8, strokeWidth: 7 }),
            minScaleDenominator: 5000,
            maxScaleDenominator: 100000
        }),

        new OpenLayers.Rule({
            filter: uninstallable,
            symbolizer: alarmSettings({ pointRadius: 15, strokeWidth: 13 }),
            maxScaleDenominator: 5000
        }),

        new OpenLayers.Rule({
            filter: installable,
            symbolizer: settings({ pointRadius: 15, strokeWidth: 13 }),
            maxScaleDenominator: 5000
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
        var clusterStrategy = _.find(stationsLayer.strategies, function(strategy) {
            return strategy instanceof OpenLayers.Strategy.Cluster;
        });

        if (!clusterStrategy) return;

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

    map.events.register("zoomend", this, ensureNoClusteringBelowZoomLevel);

    var stationPopup = {
        show: function(feature) {
            if (feature.cluster) return;

            var station = feature.data.station;
            var popup = feature.popup = new OpenLayers.Popup(
                'svv-popup-' + station.id,
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(150, 50),
                "<h3>" + station.stationName + "</h3>",
                false,
                null)

            feature.layer.map.addPopup(popup);
        },

        remove: function(feature) {
            if (feature.cluster) return;

            feature.layer.map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        }
    };

    var stationsControl = new OpenLayers.Control.SelectFeature(stationsLayer, {
        onSelect: stationPopup.show,
        onUnselect: stationPopup.remove
    });

    map.addControl(stationsControl);
    stationsControl.activate();

    return stationsLayer;
}

function datainnMap() {
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

    map.addLayer(createStationsLayer(map));
    map.addLayer(createCurrentPositionLayer(map));

    function start(currentPosition) {
        map.setCenter(new OpenLayers.LonLat(333992, 7196536), 3)
    }

    function goToCurrentPosition() {
        var layer = map.getLayersByName(currentPositionLayerName)[0];
        var features = layer.features;

        if (features.length > 0) {
            var position = features[0].geometry;
            var lonLat = new OpenLayers.LonLat(position.x, position.y);
            map.setCenter(lonLat, 7);
        }
    }

    function setCurrentPosition(position) {
        var lat = position.lat;
        var lon = position.lon;
        var layer = map.getLayersByName(currentPositionLayerName)[0];
        layer.position = position;
        var features = layer.features;

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

            layer.addFeatures(new OpenLayers.Feature.Vector(point));
        }
    }

    function showStations(stations) {
        var layer = map.getLayersByName("stations")[0];

        layer.removeAllFeatures();

        var features = stations.map(createFeatureForStation);
        layer.addFeatures(features);
    }

    function updateStation(station) {
        var layer = map.getLayersByName("stations")[0];
        var features = layer.getFeaturesByAttribute('id', station.id);

        if (features.length === 0) {
            // add to map
            layer.addFeatures([createFeatureForStation(station)]);
        } else {
            // update in map
            var feature = features[0];
            feature.station = station;
            layer.drawFeature(feature);
        }

    }

    function createFeatureForStation(station) {
        var point = new OpenLayers.Geometry.Point(station.coordinateEast, station.coordinateNorth);

        return new OpenLayers.Feature.Vector(point, {
            id: station.id,
            station: station
        });
    }

    function render(el) {
        map.render(el);
    }

    start();

    return {
        render: render,
        showStations: showStations,
        updateStation: updateStation,
        setCurrentPosition: setCurrentPosition,
        goToCurrentPosition: goToCurrentPosition
    }
}

window.onload = function() {
    var map = datainnMap();

    map.render(document.querySelector('#map'));

    var watchId = navigator.geolocation.watchPosition(function(pos) {
        console.log('current pos', pos);
        map.setCurrentPosition({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy
        });
        map.goToCurrentPosition();
    });

    setTimeout(function() {
        console.log('stop');
        navigator.geolocation.clearWatch(watchId);
    }, 30000);

    $.getJSON("/stations").done(function(stations) {
        map.showStations(stations);

        // testing station update:
        setTimeout(function() {
            var s = _.findWhere(stations, { stationName: 'GRINI' });
            s.install = true;
            map.updateStation(s);
        }, 3000);
    });

    // TODO:
    // - notified when map is moved and we are closer than a certain zoom level
    // - boundingBox()
}
