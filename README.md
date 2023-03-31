# SberLayerPlus
Расширенная версия '@sberdevices/layer-sdk'. Упрощает работу с виджетом sberLayer, 
имеет базовые настройки и настройки групп для инициализации виджета на изображениях.

## Установка и сборка

```text
npm install @symbioticphp/sber_layer_plus

npm run build
```
### После сборки будут доступны скрипты:
- ./dist/sberLayer.js - Сборка базовой версии `@sberdevices/layer-sdk`
- ./dist/sberLayerPlus.js - Сборка с расширенной версией (класс `SberLayerPlus`)

### Использование

```javascript
// Базовые настройки для всех групп и запускаемых изображений
const settings = {
    'type': 'in-image', // under-image | in-image - внутри изображения, указание container в options не требуется 
    'hide': true,
    'maxCount': 20,
    'showDiscount': true,
    'site': 'test',
    'minImageWidth': 200, // Минимальная ширина картинки , дополнительный фильтр в выборке
    'containerWidth': true,
    'observerThreshold': 0.5
};

// Можно передать в конструктор группы для отслеживания
const selectors = [
    {
        // Где будем искать картинки для работы с виджетом
        selector: '.article-gallery img',
        // Создание контейнера для будущего виджета картинки 
        containerResolver: (imgElement) => {
            // создаем контейнер, настраиваем и отдаем его HTMLElement
        },
        // Можно полностью перехватить инициализацию через данную функцию
        initFunction: (imgElement, settings) => {
            // Целиком производим инициализацию картинки
        },
        // Настройки для картинок группы, остальные настройки будут взяты из глобальных
        settings: {
            'maxCount': 10,
            'showDiscount': false,
            // Минимальная ширина картинки
            'minImageWidth': 200,
            //...
        },
        listenType: 'intersection', // or interval (old)
    },
    {
        // Настройки другой группы...
    }
];

window['mySberLoader'] = new SberLayerPlus(settings, selectors);

```

Добавление группы для отслеживания:

```javascript
 window['mySberLoader'].addImagesLoader({
    selector: '.sberImage', // <img> с классом 'sberImage'
    settings: {
        'hide': false
    }
});
```

Добавление отдельной картинки

```javascript

let imgElement = document.getElementById('sberImageID');

//
// Базовая инициализация
//
window['mySberLoader'].initImage(imgElement);

//
// Инициализация с настройками и резолвером контейнера
//
window['mySberLoader'].initImage({
    image: imgElement,
    containerResolver: (imageElement) => {// необязательная функция
        let container = document.createElement('div');
        // Настраиваем контейнер...

        imageElement.closest('.imgWrapper').apply(container);

        return container;
    },
    settings: {
        'hide': true,
        'type': 'in-image'
    }
});
```

События:

```javascript
// Перед отрисовкой контейнера виджета
// imageElement, containerElement - payload obj keys
window['mySberLoader'].listen('initContainer', function(payload) {
    
});
// Выполняется перед передачей на запуск (window.LayerSDK.render)
// {imageElement, containerElement, settings} - payload object keys
window['mySberLoader'].listen('initImage', function(payload) {

});
```
