// По дефолту `display: none`. Включается в месте устновки
export const CarouselTouchStyles = `
.CarouselTouch {
    display: none;
    height: 38px;
    width: 38px;
}

.CarouselTouchIcon {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: 500px;
    overflow: hidden;
}
.CarouselTouchIcon:not(:last-child) {
    box-shadow: 5px 0px 4px rgb(18 18 18 / 25%);
}
.CarouselTouchIcon__mask {
    background-color: #000000;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
}
.CarouselTouchIcon__icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-size: cover;
    background-repeat: no-repeat;
}
`;
