import React, { useLayoutEffect, useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const OasisGlobe = ({ properties }) => {
  const chartRef = useRef(null);
  const pointSeriesRef = useRef(null);

  useLayoutEffect(() => {
    let root = am5.Root.new("oasis-globe-div");
    
    // Set themes
    const oasisTheme = am5.Theme.new(root);
    oasisTheme.rule("InterfaceColors").setAll({
        background: am5.color(0x0f172a),
        text: am5.color(0xcbd5e0),
    });
    
    // Switch button colors
    oasisTheme.rule("Button").setAll({
        fill: am5.color(0x334155),
        stroke: am5.color(0x475569)
    });

    root.setThemes([am5themes_Animated.new(root), oasisTheme]);

    // Background Container
    root.container.set("background", am5.Rectangle.new(root, {
      fill: am5.color(0x0f172a) // Dusk background
    }));

    // Create map chart
    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator(),
      rotationX: 0,
      rotationY: 0,
      minZoomLevel: 1.7,
      maxZoomLevel: 1.7,
      zoomLevel: 1.7,
      homeGeoPoint: { latitude: 0, longitude: 0 },
      homeZoomLevel: 1.7,
      homeRotationX: 0,
      homeRotationY: 0,
      wheelY: "none",
      wheelX: "none",
      pinchZoom: false
    }));

    // Background fill (ocean)
    let bgSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    bgSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1e293b),
      fillOpacity: 0, // Hidden by default in Map view
      strokeOpacity: 0
    });
    bgSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

    // Graticule series
    let graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x94a3b8),
      strokeOpacity: 0.1,
      strokeWidth: 0.5
    });

    // Main polygon series (countries)
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow
    }));
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x334155),
      stroke: am5.color(0x475569),
      strokeWidth: 0.5,
      strokeOpacity: 0.5,
      tooltipText: "{name}"
    });

    // Hover effect for countries
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x475569)
    });

    // Point series for properties
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function() {
      let container = am5.Container.new(root, {
        cursorOverStyle: "pointer"
      });
      
      let circle = container.children.push(am5.Circle.new(root, {
        radius: 6,
        fill: am5.color(0xd4af37), // Oasis gold accent
        stroke: am5.color(0xffffff),
        strokeWidth: 1.5,
        tooltipText: "{title}\n{price} /nt"
      }));

      // Pulse animation
      let pulse = container.children.push(am5.Circle.new(root, {
        radius: 6,
        fill: am5.color(0xd4af37),
        opacity: 0.8
      }));
      pulse.animate({
        key: "radius",
        to: 20,
        loops: Infinity,
        duration: 1500,
        easing: am5.ease.out(am5.ease.cubic)
      });
      pulse.animate({
        key: "opacity",
        to: 0,
        loops: Infinity,
        duration: 1500,
        easing: am5.ease.out(am5.ease.cubic)
      });

      return am5.Bullet.new(root, {
        sprite: container
      });
    });

    pointSeriesRef.current = pointSeries;

    // Toggle Globe/Map
    var switchCont = chart.children.push(am5.Container.new(root, {
      layout: root.horizontalLayout,
      x: 20,
      y: 40
    }));

    switchCont.children.push(am5.Label.new(root, {
      centerY: am5.p50,
      text: "Globe",
      fill: am5.color(0x94a3b8),
      fontSize: 13
    }));

    var switchButton = switchCont.children.push(am5.Button.new(root, {
      themeTags: ["switch"],
      centerY: am5.p50,
      active: true, // Set to Map by default
      icon: am5.Circle.new(root, {
        themeTags: ["icon"]
      })
    }));

    switchButton.get("background").setAll({
      fill: am5.color(0x334155)
    });

    var easing = am5.ease.inOut(am5.ease.cubic);
    var duration = 1500;
    var fadeDuration = 300;

    function zoomToGlobe() {
      chart.set("projection", am5map.geoOrthographic());
      chart.set("panX", "rotateX");
      chart.set("panY", "rotateY");
      chart.animate({ key: "rotationX", to: -15, duration: duration, easing: easing });
      chart.animate({ key: "rotationY", to: -20, duration: duration, easing: easing });
      bgSeries.mapPolygons.template.set("fillOpacity", 0.8);
      chart.set("minZoomLevel", 0.9);
      chart.set("maxZoomLevel", 0.9);
      chart.animate({ key: "zoomLevel", to: 0.9, duration: duration, easing: easing });
    }

    function zoomToMap() {
      chart.set("projection", am5map.geoMercator());
      chart.set("panX", "translateX");
      chart.set("panY", "translateY");
      chart.animate({ key: "rotationX", to: 0, duration: duration, easing: easing });
      chart.animate({ key: "rotationY", to: 0, duration: duration, easing: easing });
      bgSeries.mapPolygons.template.set("fillOpacity", 0);
      chart.set("minZoomLevel", 1.7);
      chart.set("maxZoomLevel", 1.7);
      chart.animate({ key: "zoomLevel", to: 1.7, duration: duration, easing: easing });
    }

    switchButton.on("active", function () {
      chart.goHome(duration);
      setTimeout(function () {
        chart.seriesContainer.animate({ key: "opacity", to: 0, duration: fadeDuration });
      }, duration - fadeDuration);
      setTimeout(function () {
        if (switchButton.get("active")) {
          zoomToMap();
        } else {
          zoomToGlobe();
        }
        chart.seriesContainer.animate({ key: "opacity", to: 1, duration: fadeDuration });
      }, duration);
    });

    switchCont.children.push(am5.Label.new(root, {
      centerY: am5.p50,
      text: "Map",
      fill: am5.color(0x94a3b8),
      fontSize: 13
    }));

    // Auto-rotate globe (starts only if rotationX/Y are non-zero, usually handled in zoomToGlobe)
    var rotationAnimation = null;

    chart.chartContainer.events.on("pointerdown", function () {
      if (rotationAnimation) {
        rotationAnimation.stop();
        rotationAnimation = null;
      }
    });

    chart.appear(1000, 100);
    
    // Remove amCharts logo/watermark
    if (root._logo) {
      root._logo.dispose();
    }

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, []);

  // Sync properties to map
  useEffect(() => {
    if (pointSeriesRef.current && properties) {
      let data = properties.map(prop => ({
        geometry: { type: "Point", coordinates: [prop.coordinates[1], prop.coordinates[0]] }, // lng, lat
        title: prop.title,
        price: prop.price
      }));
      pointSeriesRef.current.data.setAll(data);
    }
  }, [properties]);

  return <div id="oasis-globe-div" style={{ width: "100%", height: "100%", background: "#0f172a" }}></div>;
};

export default OasisGlobe;
