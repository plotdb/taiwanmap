// Generated by LiveScript 1.3.1
(function(){
  var map, data, lc, namemap;
  map = pdmaptw.create({
    root: '#map',
    type: 'town'
  });
  data = [["縣市", "鄉鎮"]];
  lc = {
    scale: d3.interpolateSpectral
  };
  namemap = {};
  return map.init().then(function(){
    var n, render, hot, ldpp, updatePalette, view;
    map.fit();
    n = map.lc.meta.name;
    map.lc.features.map(function(it){
      var ref$, c, t;
      ref$ = [n[it.properties.c], n[it.properties.t]], c = ref$[0], t = ref$[1];
      data.push([c, t]);
      return (namemap[c] || (namemap[c] = {}))[t] = it;
    });
    render = function(){
      return d3.select(map.root).selectAll('path').attr('fill', function(it){
        var val;
        val = (it.properties.value - lc.min) / (lc.max - lc.min || 1);
        return lc.scale(val);
      });
    };
    render();
    hot = new Handsontable(sheet, {
      afterChange: function(){
        data.map(function(it){
          if (namemap[it[0]]) {
            return namemap[it[0]][it[1]].properties.value = it[2];
          }
        });
        lc.max = Math.max.apply(null, data.map(function(it){
          return it[2] || 0;
        }));
        lc.min = Math.min.apply(null, data.map(function(it){
          return it[2] || 0;
        }));
        return render();
      },
      data: data,
      rowHeaders: true,
      colHeaders: true,
      filters: true,
      dropdownMenu: true,
      stretchH: 'all',
      rowHeights: 25,
      minRows: 50,
      minCols: 15
    });
    ldpp = ldPalettePicker.init({
      ldcv: {}
    });
    console.log(ldpp[0].get);
    updatePalette = function(ret){
      var pal, d;
      pal = ret.colors.map(function(it){
        return ldColor.hex(it);
      });
      d = pal.map(function(d, i){
        return i / (pal.length - 1);
      });
      lc.scale = d3.scaleLinear().domain(d).range(pal).interpolate(d3.interpolateHcl);
      return render();
    };
    ldpp[0].get().then(function(ret){
      return updatePalette(ret);
    });
    return view = new ldView({
      root: document.body,
      action: {
        click: {
          palette: function(arg$){
            var node;
            node = arg$.node;
            return ldpp[0].get().then(function(ret){
              return updatePalette(ret);
            });
          },
          random: function(arg$){
            var node;
            node = arg$.node;
            data.map(function(it){
              return it[2] = Math.round(Math.random() * 100);
            });
            hot.loadData(data);
            return hot.render();
          }
        }
      }
    });
  });
})();
/*
  * customizable data path
  * map init promise hint in doc
  * properties access
  * how to customize
  * how to access / update data
*/