(function(B, $, _Bokeh) {
    
    B.activateWheelZoom = function () {
      for (plot_index in _Bokeh.index) {
         var plot_tools = _Bokeh.index[plot_index].tools;
          for (tool_index in plot_tools) { 
             var tool = plot_tools[tool_index];
                if (tool.mget('tool_name') == 'Wheel Zoom') {
                       tool.mset('active', true);
                  }
               }
        }
    }

    /**
     * Sets plot_height and plot_width to closest jquery selector
     */
    B.resizeToClosest = function(width_selector, height_selector) {

        if (typeof(width_selector)==='undefined') {
            width_selector = '[class^="col"]';
        }

        if (typeof(height_selector)==='undefined') {
            height_selector = '[class^="row"]';
        }

        var height, width;
        $.each(_Bokeh.index, function(index, value) {

            if (typeof(value.el) == 'undefined') {
              return;
            }

            width = $(value.el.closest(width_selector)).width();
            height = $(value.el.closest(height_selector)).height();
            value.model.set('plot_width', width);
            value.model.set('plot_height', height);

            value.canvas.set('width', width);
            value.canvas.set('height', height);

            value.request_render();
        });
    };

    B.setPlotSizeByTag = function(tagName, height, width) {
        $.each(_Bokeh.index, function(index, value) {
            if ($.inArray(tagName, value.model.attributes.tags) > -1) {
                value.model.set('plot_width', width);
                value.model.set('plot_height', height);
            }
        });

    };

    /**
     * Returns first plot object with specified tag
     */
    B.getPlotByTag = function(tagName) {
        var plot;
        $.each(_Bokeh.index, function(index, value) {
            if ($.inArray(tagName, value.model.attributes.tags) > -1) {
                plot = value;
                return;
            }
        });
        return plot;
    };

    /**
     * Returns first plot object with specified tag
     */
    B.getAjaxDataSourceByTag = function(tagName) {
        var source;
        $.each(_Bokeh.Bokeh.Collections("AjaxDataSource").models, function(index, value) {
            if ($.inArray(tagName, value.attributes.tags) > -1) {
                source = value;
                return;
            }
        });
        return source;
    };

    /**
     * Returns first plot object with specified tag
     */
    B.getPlotsByTag = function(tagName) {
        var plots = [];
        $.each(_Bokeh.index, function(index, value) {
            if ($.inArray(tagName, value.model.attributes.tags) > -1) {
                plots.push(value);
            }
        });

        return plots;

    };

    /**
     * Updates X-Range of plot by tag
     */
    B.updateXRangeByTag = function(tagName, start, end) {
        var plot = B.getPlotByTag(tagName);
        plot.model.get("x_range").set({start:start, end:end});
    };

    /**
     * Updates Y-Range of plot by tag
     */
    B.updateYRangeByTag = function(tagName, start, end) {
        var plot = B.getPlotByTag(tagName);
        plot.model.get("y_range").set({start:start, end:end});
    };

    /**
     * Finds and returns all glyph renderers of specific type (e.g. ImageRGBA)
     */
    B.getGlyphRenderersByType = function(plot, glyphType) {
        var allRenderers = plot.model.get("renderers");
        var renderers = [];
        $.each(plot.model.get("renderers"), function(index, value) {
            if (value.attributes.hasOwnProperty("glyph") && value.attributes.glyph.type === glyphType) {
                renderers.push(value);
            }
        });

        return renderers;
    };

    /**
     * Finds and returns all glyph renderers of specific type (e.g. ImageRGBA)
     */
    B.getRenderersByType = function(plot, rendererType) {
        var allRenderers = plot.model.get("renderers");
        var renderers = [];
        $.each(plot.model.get("renderers"), function(index, value) {
            if (value.type == rendererType) {
                renderers.push(value);
            } 
        });

        return renderers;
    };

    /**
     * Updates image data for first ImageRGBA glyph renderer
     */
    B.updateImageData = function(tagName, options) {
        var plot = B.getPlotByTag(tagName);
        var renderer = B.getGlyphRenderersByType(plot, "ImageRGBA")[0];
        var d = renderer.get("data_source").get("data");
        $.each(options, function(prop, value) {
            if (d.hasOwnProperty(prop)) {
                d[prop] = value;
            }
        });
        renderer.get("data_source").set("data", d);
        renderer.get("data_source").trigger("change");
    };

    /**
     * Finds and returns grid renderer of specific plot
     */
    B.getGridRenderers = function(tagName) {

        var plots = B.getPlotsByTag(tagName);

        if (typeof(plots) === 'undefined') {
              return;
        }

        var _filterRenderers = function(val, ind, arr) {
            return val.hasOwnProperty("grid_props");
        };

        var renderers = [];
        var g, n;
        $.each(plots, function (i, plot) {
            $.each(plot.renderers, function(i, r) {
                if (r.hasOwnProperty("grid_props")) {
                    r.plot = plot;
                    renderers.push(r);
                }
            });
        });

        return renderers;
    };

    /**
     * Update plot grid alphas by tag
     */
    B.updateGridAlphas = function(tagName, val) {

        var renderers = B.getGridRenderers(tagName);

        if (typeof(renderers) == 'undefined') {
            return;
        }

        $.each(renderers, function(index, ren) {
            ren.grid_props.alpha.fixed_value = val;
            ren.plot.request_render();
        });
    };

    /**
     * Grab the .bk-canvas
     */
    B.getCanvasByTag = function(tagName) {
        var plot = B.getPlotByTag(tagName);
        return plot.$el.find(".bk-canvas")[0];
    };


}(window.B = window.B || {}, jQuery, Bokeh));
