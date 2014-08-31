Subviewify
==========

Browserify transform for the Subview Environment (work in progress).  The transform searches for templates and less files associated with javascript file being processed by browserify and, if the javascript file defines a subview component, adds the template and the compiled css as arguments to the subview function. In addition, subviewify searches through the template for included subviews and adds a list of `require` statements for the subviews.

Subviewify is being developed alongside a new version of [subview.js](http://subviewjs.com) that will allow for the creation of highly isolated client-side user interface components.
