<template>
    <div class="signin-view">
        <svg class="bk-svg">
             <!-- <text  v-for="(point, $index) in pois" :key="$index" :x="point[0]" font-size="8"  :y="point[1]" :fill="lineColor([point])">
                     {{$index + 1}} 
                </text>  -->
            <circle v-for="(point, $index) in backPoints" :key="$index" :cx="point[0]" :cy="point[1]" r="2" fill="#f5f5f5"></circle> 
            <circle v-for="(point, $index) in pois" :key="$index" :cx="point[0]" :cy="point[1]" r="6" :fill="fillColor(point)" stroke="#efefef" stroke-width="3"></circle>
            <polyline v-for="(line, $index) in lines" :key="$index" :points="line" :stroke-width="lineWidth" :stroke="lineColor(line)"></polyline>
        </svg>
    </div>
</template>
<script>
import TWEEN from '@tweenjs/tween.js';
export default {
    name: 'signinview',
    data () {
        return {
            circle: null,
            pointCount: 100,
            points: [],
            tweenPoints: '',
            lines: [],
            viewHeight: 0,
            viewWidth: 0,
            lineWidth: 2,
            timer: null,
            lineLength: 1,
            updateTime: 100000,

            backPoints: []
        }
    },
    mounted () {
        let svg = document.querySelector('svg');
        this.viewHeight = this.$el.clientHeight;
        this.viewWidth = this.$el.clientWidth;

        this.tweenPoints = this.wrapTweenPoints(this.generatePoints(this.pointCount));

        this.points = this.generatePoints(this.pointCount);

        this.checkPoints(this.points);

        this.updater();

        for (let i = 0; i < this.viewWidth; i+=20) {
            for (let j = 0; j < this.viewHeight; j+=20) {
                this.backPoints.push([i, j]);
            }
        }
    },
    computed: {
        pois: function () {
            let p = this.unwrapTweenPoints(this.tweenPoints);
            p && (this.lines = this.checkPoints(p));
            return p;
        }
    },
    watch: {
        points: function (n) {
            TweenLite.to(
                this.$data,
                this.updateTime / 1000,
                {
                    tweenPoints: this.wrapTweenPoints(n),
                    ease:Linear.easeInOut
                }
            );
        }
    },
    methods: {
        generatePoints: function (num) {
            let points = [];
            for (let i = 0; i < num; i++) {
                points.push([
                    Math.floor(this.viewWidth * Math.random(1)),
                    Math.floor(this.viewHeight * Math.random(1))
                ]);
            }
            return points;
        },
        checkPoints: function (points) {
            let lines = [];
            for (let _1 = 0; _1 < points.length; _1++) {
                if (_1 < points.length - 2) {
                    for (let _2 = _1 + 1; _2 < points.length; _2++) {
                        if (Math.pow(points[_1][0] - points[_2][0], 2) + Math.pow(points[_1][1] - points[_2][1], 2) < Math.pow(this.lineLength, 2)) {
                            lines.push([
                                points[_1],
                                points[_2]
                            ]);
                        }
                    }
                }
            }
            return lines;
        },
        updater: function () {
            clearInterval(this.timer);

            this.timer = setInterval(() => {
                this.points = this.generatePoints(this.pointCount);
            }, this.updateTime);
        },
        wrapTweenPoints: function (points) {
            let temp = [];
            points.forEach(point => {
                temp.push(point.join(','));
            });
            return temp.join(' ');
        },
        unwrapTweenPoints: function (t) {
            if (!t) return;

            let result = [];
            let a = t.split(' ');
            a.forEach(_a => {
                result.push(_a.split(','));
            });

            return result;
        },
        lineColor: function (line) {
            return `hsl(${line[0][0] / this.viewWidth * 270}, 100%, 80%)`;
        },
        fillColor: function (point) {
            return `hsl(${point[1] / this.viewHeight * 270}, 100%, 80%)`;
        }
    }
}
</script>
<style lang="sass" scoped>
.signin-view {
    height: 100%;
    width: 100%;
    .bk-svg {
        height: 100%;
        width: 100%;
    }
}
</style>


