# adapt-results-graphic  

**Results Graphic** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

## Settings Overview

The attributes listed below are used in *components.json* to configure **Results Graphic**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-results-graphic/blob/master/example.json). Visit the [**Graphic** wiki](https://github.com/deltanet/adapt-results-graphic/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `results-graphic`.

**_classes** (string): CSS class name to be applied to **Results Graphic**’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**_graphic** (object): The image that constitutes the component. It contains values for **alt**, **large**, and **small**.

>**alt** (string): This text becomes the image’s `alt` attribute.

>**large** (string): File name (including path) of the image used with large device width. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).  

>**small** (string): File name (including path) of the image used with small device width. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).  

>**attribution** (string): Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`  

## Accessibility
+ Remember to include an **alt** attribute for all your images. Screen readers will read aloud alt text content, so leave the alt text empty (`"alt": ""`) if the image does not contribute significant course content.  
+ If the alt text is left empty, the image will *not* be included in the tab order. If the component is configured to display [title or body text]((https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)), these will remain keyboard accessible.  
+ If the alt text is assigned a value, but the component is not being tracked for course completion, assign the class `"no-state"` to **_classes**. Adapt's accessibility mode reports to the learner the 'state' of the component, whether it is complete or incomplete. It is not common practice to require interaction with (or 'completion' of) an image for course completion. Indeed, a screen reader needlessly announcing the state of an image may be distracting for the learner. Assigning the built-in class `"no-state"` prevents this.  

## Limitations

No known limitations.  

----------------------------
**Version number:**  2.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>
**Framework versions:** 2.0  
**Author / maintainer:** DeltaNet [contributors](https://github.com/deltanet/adapt-results-graphic/graphs/contributors)   
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, IE10, IE9, IE8, IE Mobile 11, Safari iOS 9+10, Safari OS X 9+10, Opera    
