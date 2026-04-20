import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Globe, Map as MapIcon, Plane, TrendingUp, Navigation, Users } from 'lucide-react';

const MarketAnalytics = () => {
  const chartRef = useRef(null);
  const [isGlobe, setIsGlobe] = useState(true);

  useLayoutEffect(() => {
    const root = am5.Root.new("marketChartDiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Grainy paper background (High-tech adaptation)
    root.container.set("background", am5.Rectangle.new(root, {
      fill: am5.color(0x0f172a),
      fillOpacity: 1,
      fillPattern: am5.GrainPattern.new(root, {
        density: 0.1,
        maxOpacity: 0.05,
        colors: [am5.color(0x000000)]
      })
    }));

    // Create the map chart
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "rotateY",
      projection: am5map.geoOrthographic(),
      rotationX: -15,
      rotationY: -20,
      minZoomLevel: 0.9,
      maxZoomLevel: 0.9,
      zoomLevel: 0.9,
      homeGeoPoint: { latitude: 0, longitude: 0 },
      homeZoomLevel: 0.9,
      homeRotationX: -15,
      homeRotationY: -20,
      wheelY: "none",
      wheelX: "none",
      pinchZoom: false
    }));

    chartRef.current = chart;

    // Create series for background fill (The Ocean)
    const bgSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    bgSeries.mapPolygons.template.setAll({
      fill: am5.color(0x0f172a),
      fillOpacity: 1,
      strokeOpacity: 0
    });
    bgSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

    // Create graticule series
    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x334155),
      strokeOpacity: 0.2,
      strokeWidth: 0.5
    });

    // Create main polygon series for countries
    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow
    }));

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1e293b),
      stroke: am5.color(0x334155),
      strokeWidth: 0.5,
      fillOpacity: 1
    });

    // Define Origins and Hubs
    const originIds = ["US", "GB", "JP", "AE", "SG", "DE"];
    const hubIds = ["MV", "ID", "FR", "CH", "TH"];

    polygonSeries.events.on("datavalidated", () => {
      am5.array.each(polygonSeries.dataItems, (di) => {
        const id = di.get("id");
        if (id && originIds.includes(id)) {
          di.get("mapPolygon").setAll({ fill: am5.color(0x334155) });
        } else if (id && hubIds.includes(id)) {
          di.get("mapPolygon").setAll({ fill: am5.color(0xd4af37), fillOpacity: 0.3 });
        }
      });
    });

    // Create Map Sankey series
    const sankeySeries = chart.series.push(am5map.MapSankeySeries.new(root, {
      polygonSeries: polygonSeries,
      maxWidth: 2,
      controlPointDistance: 0.4,
      resolution: 60,
      nodePadding: 0.3
    }));

    // Flow line styling (TripNest Gold)
    sankeySeries.mapPolygons.template.setAll({
      fill: am5.color(0xd4af37),
      fillOpacity: 0.4,
      strokeOpacity: 0,
      tooltipText: "{sourceNode.name} → {targetNode.name}: [bold]{value}[/] guests"
    });

    // Node styling
    sankeySeries.nodes.mapPolygons.template.setAll({
      fill: am5.color(0xd4af37),
      stroke: am5.color(0xffffff),
      strokeWidth: 1,
      fillOpacity: 0.9,
      tooltipText: "{name}: [bold]{sum}[/] Total Traffic"
    });

    // Pulse bullets (Sleek aircraft/data pulse)
    sankeySeries.bullets.push(() => {
      const container = am5.Container.new(root, {});
      
      // Outer glow
      const glow = container.children.push(am5.Circle.new(root, {
        radius: 4,
        fill: am5.color(0xd4af37),
        fillOpacity: 0.3,
        scale: 1
      }));

      // Inner core
      const circle = container.children.push(am5.Circle.new(root, {
        radius: 2,
        fill: am5.color(0xd4af37),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5,
        visible: false
      }));

      return am5.Bullet.new(root, {
        locationX: 0,
        autoRotate: true,
        sprite: container
      });
    });

    // Mock Data
    sankeySeries.data.setAll([
      // High-Value Guest Segments -> Hubs
      { sourceId: "US", targetId: "MV", value: 1250 },
      { sourceId: "US", targetId: "FR", value: 850 },
      { sourceId: "GB", targetId: "MV", value: 950 },
      { sourceId: "GB", targetId: "ID", value: 600 },
      { sourceId: "GB", targetId: "CH", value: 450 },
      { sourceId: "JP", targetId: "ID", value: 1100 },
      { sourceId: "JP", targetId: "TH", value: 900 },
      { sourceId: "AE", targetId: "MV", value: 1400 },
      { sourceId: "AE", targetId: "FR", value: 700 },
      { sourceId: "SG", targetId: "ID", value: 800 },
      { sourceId: "DE", targetId: "CH", value: 1200 },
      { sourceId: "DE", targetId: "MV", value: 300 }
    ]);

    const countryNames = {
      US: "North America (Luxury)",
      GB: "UK & Northern Europe",
      JP: "East Asia Premium",
      AE: "Middle East Elite",
      SG: "SE Asia Hub",
      DE: "Central Europe",
      MV: "Maldives Hub",
      ID: "Bali Sanctuary",
      FR: "Paris Collection",
      CH: "Swiss Alp Retreat",
      TH: "Thai Estates"
    };

    sankeySeries.events.on("datavalidated", () => {
      am5.array.each(sankeySeries.nodes.dataItems, (di) => {
        const id = di.get("id");
        if (id && countryNames[id]) {
          di.set("name", countryNames[id]);
        }
      });

      am5.array.each(sankeySeries.dataItems, (dataItem) => {
        const bullets = dataItem.bullets;
        if (bullets) {
          am5.array.each(bullets, (bullet) => {
            const randomDur = 4000 + Math.random() * 4000;
            const delay = Math.random() * randomDur;
            setTimeout(() => {
              if (root.isDisposed()) return;
              const sprite = bullet.get("sprite");
              if (sprite) {
                const circle = sprite.children.getIndex(1);
                const glow = sprite.children.getIndex(0);
                if (circle) circle.set("visible", true);
                
                // Animate glow
                if (glow && glow.animate) {
                  glow.animate({
                    key: "scale",
                    from: 1,
                    to: 2.5,
                    duration: 1000,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                  });
                  glow.animate({
                    key: "opacity",
                    from: 0.6,
                    to: 0,
                    duration: 1000,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                  });
                }
              }
              
              bullet.animate({
                key: "locationX",
                from: 0,
                to: 1,
                duration: randomDur,
                easing: am5.ease.linear,
                loops: Infinity
              });
            }, delay);
          });
        }
      });
    });

    // Auto-rotate globe
    let rotationAnimation = chart.animate({
      key: "rotationX",
      from: -15,
      to: -15 + 360,
      duration: 180000,
      loops: Infinity,
      easing: am5.ease.linear
    });

    chart.chartContainer.events.on("pointerdown", () => {
      if (rotationAnimation) {
        rotationAnimation.stop();
        rotationAnimation = null;
      }
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  const toggleProjection = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const duration = 1500;
    const easing = am5.ease.inOut(am5.ease.cubic);
    const fadeDuration = 300;

    chart.seriesContainer.animate({ key: "opacity", to: 0, duration: fadeDuration });

    setTimeout(() => {
      if (isGlobe) {
        // Switch to Map
        chart.set("projection", am5map.geoMercator());
        chart.set("panX", "translateX");
        chart.set("panY", "translateY");
        chart.animate({ key: "rotationX", to: 0, duration: duration, easing: easing });
        chart.animate({ key: "rotationY", to: 0, duration: duration, easing: easing });
        chart.set("minZoomLevel", 1.5);
        chart.set("maxZoomLevel", 1.5);
        chart.animate({ key: "zoomLevel", to: 1.5, duration: duration, easing: easing });
      } else {
        // Switch to Globe
        chart.set("projection", am5map.geoOrthographic());
        chart.set("panX", "rotateX");
        chart.set("panY", "rotateY");
        chart.animate({ key: "rotationX", to: -15, duration: duration, easing: easing });
        chart.animate({ key: "rotationY", to: -20, duration: duration, easing: easing });
        chart.set("minZoomLevel", 0.9);
        chart.set("maxZoomLevel", 0.9);
        chart.animate({ key: "zoomLevel", to: 0.9, duration: duration, easing: easing });
      }
      setIsGlobe(!isGlobe);
      chart.seriesContainer.animate({ key: "opacity", to: 1, duration: fadeDuration });
    }, fadeDuration);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Market Intelligence</h1>
          <p className="text-muted text-lg">Real-time global guest flows & origin analytics</p>
        </div>
        <div className="flex gap-4">
          <Card variant="glass" className="px-6 flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
             <div className="p-2 flex items-center justify-center" style={{ borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--text-accent)' }}>
                <Users size={18} />
             </div>
             <div>
                <p className="text-xs text-muted uppercase tracking-widest font-bold">Top Origin Market</p>
                <p className="text-xl font-bold">Middle East Elite</p>
             </div>
          </Card>
          <Card variant="glass" className="px-6 flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
             <div className="p-2 flex items-center justify-center" style={{ borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--text-accent)' }}>
                <Navigation size={18} />
             </div>
             <div>
                <p className="text-xs text-muted uppercase tracking-widest font-bold">Avg. Travel Dist</p>
                <p className="text-xl font-bold">6,420 km</p>
             </div>
          </Card>
          <Card variant="glass" className="px-6 flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
             <div className="p-2 flex items-center justify-center" style={{ borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--text-accent)' }}>
                <TrendingUp size={18} />
             </div>
             <div>
                <p className="text-xs text-muted uppercase tracking-widest font-bold">Active Flows</p>
                <p className="text-xl font-bold">142 Inbound</p>
             </div>
          </Card>
        </div>
      </div>

      <div className="relative w-full overflow-hidden border border-white/5 shadow-2xl" style={{ height: '700px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div id="marketChartDiv" className="w-full h-full" style={{ height: '100%' }} />
        
        {/* Map UI Overlay */}
        <div className="absolute top-8 left-8 flex flex-col gap-4 z-10">
          <button 
            onClick={toggleProjection}
            className="w-12 h-12 flex items-center justify-center text-white transition-all shadow-lg group"
            style={{ 
              borderRadius: '12px', 
              background: 'rgba(15, 23, 42, 0.8)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}
          >
            {isGlobe ? <MapIcon size={20} /> : <Globe size={20} />}
          </button>
        </div>

        <div className="absolute bottom-8 right-8 z-10">
           <div className="p-6 bg-slate-950/40 backdrop-blur-xl border border-white/5 max-w-xs" style={{ borderRadius: '16px', background: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Market Sentiment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ marginBottom: '16px' }}>
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-muted">High-Value (Luxury)</span>
                       <span className="text-accent">78%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                       <div className="h-full bg-accent" style={{ width: '78%', height: '100%', background: 'var(--text-accent)' }} />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-muted">Corporate Elite</span>
                       <span className="text-accent">42%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                       <div className="h-full bg-accent" style={{ width: '42%', height: '100%', background: 'var(--text-accent)' }} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Cinematic Grain Overlay (Visual only) */}
        <div className="absolute inset-0 pointer-events-none grainy-overlay" style={{ opacity: 0.05, mixBlendMode: 'overlay' }} />
      </div>

      <style>{`
        .grainy-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          filter: brightness(100%);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MarketAnalytics;
