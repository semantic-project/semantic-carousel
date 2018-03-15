# semantic-carousel

## Quick start

#### Static HTML

Put the required stylesheet:

```html
<link rel="stylesheet" href="dist/css/semantic.carousel.min.css" />
```

Put the the required script.

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="dist/js/semantic.carousel.js"></script>
```

### Usage

```html
<div id="semantic-carousel" class="semantic-carousel">
  <div class="semantic-inner-carousel">
     <ul class="list-items horizontal-item">
            <li class="item">
                <span class="list-item">
                    <a href="" class="inline-link">
                        <img class="img-carousel" src="img/img-1.jpg" />
                    </a>
                </span>
           </li>
            <li class="item">
                <span class="list-item">
                    <a href="" class="inline-link">
                        <img class="img-carousel" src="img/img-2.jpg" />
                    </a>
                </span>
           </li>
           ...
     </ul>
  </div>
</div>
```
Call the plugin function and your carousel is ready.

```javascript
$(document).ready(function(){
   $('#semantic-carousel').semanticCarousel();
});
```

## License

The code and the documentation are released under the [MIT License](LICENSE).
