# adapt-results-graphic  

**Results Graphic** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

This component allows an image to be displayed based on the score for a specific assessment or the entire course assessment score.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Results Graphic**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-results-graphic/blob/master/example.json).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `results-graphic`.

**_classes** (string): CSS class name to be applied to **Results Graphic**’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**_assessmentId** (string): This value must match the [`_id` of the assessment](https://github.com/adaptlearning/adapt-contrib-assessment#attributes) for which results should be displayed.  

**_isVisibleBeforeCompletion** (boolean): Determines whether this component will be visible as the learner enters the assessment article or if it will be displayed only after the learner completes all question components. Acceptable values are `true` or `false`. The default is `false`.

**_graphic** (object): The image that constitutes the component. It contains values for **alt**, and **_src**.

>**alt** (string): This text becomes the image’s `alt` attribute.

>**_src** (string): File name (including path) of the image used. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).  

**_bands** (object array): Multiple items may be created. Each item represents the image for the appropriate range of scores. **_bands** contains values for **_score**, **_graphic** and **alt**.

>**_score** (number):  This numeric value represents the raw score or percentile (as determined by the configuration of [adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment)) that indicates the low end or start of the range. The range continues to the next highest **_score** of another band.

>**_graphic** (string): File name (including path) of the image used. Path should be relative to the *src* folder.  

>**alt** (string): This text becomes the image’s `alt` attribute.

## Accessibility
+ Remember to include an **alt** attribute for all your images. Screen readers will read aloud alt text content, so leave the alt text empty (`"alt": ""`) if the image does not contribute significant course content.  
+ If the alt text is left empty, the image will *not* be included in the tab order. If the component is configured to display [title or body text]((https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)), these will remain keyboard accessible.  
+ If the alt text is assigned a value, but the component is not being tracked for course completion, assign the class `"no-state"` to **_classes**. Adapt's accessibility mode reports to the learner the 'state' of the component, whether it is complete or incomplete. It is not common practice to require interaction with (or 'completion' of) an image for course completion. Indeed, a screen reader needlessly announcing the state of an image may be distracting for the learner. Assigning the built-in class `"no-state"` prevents this.  

## Limitations

No known limitations.  

----------------------------
**Version number:**  4.0.0  
**Framework versions:** 5.0  
**Author / maintainer:** DeltaNet [contributors](https://github.com/deltanet/adapt-results-graphic/graphs/contributors)   
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, Safari iOS 9+10, Safari OS X 12    
