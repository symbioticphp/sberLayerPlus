/**
 *
 * @param {{
 * 'type':String,
 * 'hide':Boolean,
 * 'site':String,
 * 'minImageWidth':Number,
 * 'showDiscount':Boolean,
 * 'imagesFindInterval':Number,
 * 'containerWidth':Boolean
 * }, Undefined} settings
 *
 * @param  {Array} selectors
 *
 * @author Surkov Sergey <php.fastcgi@gmail.com>
 */
module.exports = class SberLayerPlus {


    imagesLoaderSelectors = [];

    events = {
        'initContainer': [], // ({image, container}) => {}...
        'initImage': [] // ({image, container, settings}) => {}...
    };

    settings = {
        'type': 'in-image',
        'hide': true,
        'site': 'test',
        'showDiscount': true,
        'maxCount': 20,
        'minImageWidth': 200,
        'containerWidth': false,
        'observerThreshold': 0.5,
        'loaderInterval': 300
    };

    containerClasses = ['SymSberLayer_item_container'];

    loadedImageMarker = 'sbLayerInited';

    constructor(settings, selectors) {
        this.setSettings(settings);

        if (selectors instanceof Array) {
            selectors.forEach((selector) => {
                this.runSelectorListen(selector);
            });
        }
    }

    /**
     *
     * @param {{
     * 'type':String,
     * 'hide':Boolean,
     * 'site':String,
     * 'minImageWidth':Number,
     * 'observerThreshold':Number,
     * 'containerWidth':Boolean
     * }, Undefined} settings
     */
    setSettings(settings) {
        if (typeof settings !== 'object') {
            settings = {};
        }

        for (let k in settings) {
            if (settings.hasOwnProperty(k)) {
                this.settings[k] = settings[k];
            }
        }
    }

    /**
     *
     * @param {{
     * selector:String,
     * settings:{Object,undefined},
     * containerResolver:{Function, undefined},
     * initFunction:{Function, undefined},
     * }} config
     */
    addImagesLoader(config) {

        this.imagesLoaderSelectors.push(config);
        this.runSelectorListen(config);

    }

    /**
     *
     * @param {HTMLImageElement} imgElement
     * @param {{'hide':Boolean,'type':String,'site':String}, undefined} settings
     * @param {Function, undefined} containerResolver
     */
    initImageDefault(imgElement, settings, containerResolver) {

        let container = typeof containerResolver === 'function' ?
            containerResolver(imgElement)
            : this.initContainer(imgElement);

        settings = this.prepareSettings(settings);

        this.loadSberLayer(imgElement, container, settings);
    }

    /**
     * @param {{
     * 'image': HTMLImageElement,
     * 'settings': {Object, undefined},
     * 'initFunction': {Function, undefined},
     * 'containerResolver':{Function, undefined}
     * }} imageConfig
     */
    /**
     *
     * @param {HTMLImageElement} imgElement
     * @param {{
     *     'hide': {Boolean, undefined},
     *     'type': {String, undefined},
     *     'site': {String, undefined},
     *     'initFunction': {Function, undefined},
     *     'containerResolver': {Function, undefined},
     * },undefined} settings
     *
     * @return {boolean}
     */
    initImage(imgElement, settings) {
        settings = settings || {};
        if (!imgElement.hasAttribute(this.loadedImageMarker) && imgElement.clientWidth >= this.settings.minImageWidth) {

            imgElement.setAttribute(this.loadedImageMarker, '1');
            settings = this.prepareSettings(settings);

            if (settings.hasOwnProperty('initFunction') && typeof settings.initFunction === 'function') {
                settings.initFunction(imgElement, settings);
            } else if (settings.hasOwnProperty('containerResolver') && typeof settings.containerResolver === 'function') {
                this.initImageDefault(imgElement, settings, settings.containerResolver);
            }
            return true;
        }
        return false;
    }

    /**
     *
     * @param {Object|undefined} settings
     *
     * @return {{type:String, hide:Boolean, site:String}}
     */
    prepareSettings(settings) {
        if (typeof settings !== 'object') {
            settings = {};
        }
        if (!settings.hasOwnProperty('hide')) {
            settings['hide'] = this.settings.hide;
        }
        if (!settings.hasOwnProperty('type')) {
            settings['type'] = this.settings.type;
        }

        if (!settings.hasOwnProperty('site')) {
            settings['site'] = this.settings.site;
        }
        if (!settings.hasOwnProperty('showDiscount')) {
            settings['showDiscount'] = this.settings.showDiscount;
        }
        if (!settings.hasOwnProperty('maxCount')) {
            settings['maxCount'] = this.settings.maxCount;
        }

        return settings;
    }

    /**
     * @param {HTMLImageElement} imgElement
     * @return {HTMLElement}
     */
    initContainer(imgElement) {
        let container = document.createElement("div");

        // set classes
        for (let k in this.containerClasses) {
            if (this.containerClasses.hasOwnProperty(k)) {
                container.classList.add(this.containerClasses[k]);
            }
        }
        // set image width
        if (this.settings.containerWidth) {
            container.style.width = imgElement.clientWidth + 'px';
        }

        this.dispatch('initContainer',
            {image: imgElement, container: container}
        );

        imgElement.after(container);

        return container;

    }

    /**
     *
     * @param imgElement
     * @param container
     * @param settings
     * @return Сейчас void, но позже для управления могут передавать объект API
     */
    loadSberLayer(imgElement, container, settings) {
        this.dispatch('initImage', {image: imgElement, container: container, settings: settings});
        window.LayerSDK.render(settings['type'], {
            container: container,
            image: imgElement,
            hiddenByDefault: settings['hide'],
            site: settings['site'],
            maxCount: settings['maxCount'],
            showDiscount: settings['showDiscount'],
        });
    }

    /**
     *
     * @param {String} eventName
     * @param {Function} callback
     */
    listen(eventName, callback) {
        if (this.events.hasOwnProperty(eventName)) {
            throw 'Invalid Event name [' + eventName + ']!';
        }
        this.events[eventName].push(callback);
    }

    /**
     *
     * @param {String} eventName
     * @param {undefined,Object} payload
     */
    dispatch(eventName, payload) {
        if (!this.events.hasOwnProperty(eventName)) {
            throw 'Event [' + eventName + '] not found';
        }
        let handlers = this.events[eventName];
        for (let k in handlers) {
            if (handlers.hasOwnProperty(k)) {
                handlers[k](payload);
            }
        }
    }

    /**
     *
     * @param {{
     *     'selector' : String,
     *     'initFunction': {Function, undefined},
     *     'containerResolver': {Function, undefined},
     *     'settings': {Object, undefined}
     * }} selectorData
     */
    runSelectorListen(selectorData) {
        let listenType = selectorData.hasOwnProperty('listenType') ?
            selectorData.listenType
            : 'intersection';

        let mergeSettings = (selectorData) => {
            let settings = {};
            if (selectorData.hasOwnProperty('settings') && typeof selectorData.settings === 'object') {
                settings = selectorData['settings'];
            }
            if (selectorData.hasOwnProperty('initFunction')) {
                settings['initFunction'] = selectorData['initFunction'];
            }
            if (selectorData.hasOwnProperty('containerResolver')) {
                settings['containerResolver'] = selectorData['containerResolver'];
            }
            return settings;
        };
        if (listenType === 'intersection') {
            var observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting
                            && !entry.target.hasAttribute(this.loadedImageMarker)
                            && entry.target.clientWidth >= this.settings.minImageWidth) {

                            if (this.initImage(entry.target, mergeSettings(selectorData))) {
                                observer.unobserve(entry.target);
                            }
                        }
                    })
                },
                {
                    root: null,
                    rootMargin: '0px',
                    threshold: this.settings.observerThreshold
                }
            );
            document.querySelectorAll(selectorData.selector)
                .forEach(i => {
                    observer.observe(i)
                });
        } else {
            setInterval(() => {
                var Images = document.querySelectorAll(selectorData.selector);
                Images.forEach(imageElement => {
                    if (!imageElement.hasAttribute(this.loadedImageMarker)
                        && imageElement.clientWidth >= this.settings.minImageWidth) {
                        this.initImage(imageElement, mergeSettings(selectorData));
                    }
                });
            }, this.settings.loaderInterval);
        }
    }

}