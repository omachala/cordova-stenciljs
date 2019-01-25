import { Component } from '@stencil/core';
import { Draggable, ModifiersPlugin, TweenLite, Linear, TweenMax, TimelineLite, Power3 } from 'gsap/all';

@Component({
    tag: 'com-day-carousel',
    styleUrl: 'com-day-carousel.css',
    shadow: true
})
export class DayCarouselComponent {

    private viewportElement: HTMLDivElement;
    private wrapperElement: HTMLDivElement;
    private boxesElement: HTMLDivElement;

    private timeline: TimelineLite = new TimelineLite();
    private animation: TweenMax;
    private viewWidth: number;

    private numBoxes: number = 80;
    private boxWidth: number = 35;
    private boxHeight: number = 40;

    private boxes: Array<Element> = [];
    private selectedBoxNum: number = 1;

    private accumulatedProgress = 0;

    private calculatedProgress: Array<any> = [];
    private gap: number = 0;

    constructor() { }

    componentDidLoad() {

        const $proxy = document.createElement('div');

        this.viewWidth = this.viewportElement.clientWidth;
        const wrapWidth = this.numBoxes * this.boxWidth;

        TweenLite.set([this.wrapperElement, this.viewportElement], { height: this.boxHeight, xPercent: -50 });
        TweenLite.set(this.boxesElement, { left: -this.boxWidth });

        this.generateBoxes();

        const modifiers: ModifiersPlugin = {
            x: (x: number, target: HTMLElement) => {
                x = x % wrapWidth;
                target.style.visibility = x - this.boxWidth > this.viewWidth ? 'hidden' : 'visible';
                return x;
            }
        };

        this.animation = TweenMax.to(this.boxes, 1, {
            x: '+=' + wrapWidth,
            ease: Linear.easeNone,
            paused: true,
            repeat: -1,
            modifiers: modifiers
        });

        this.recalculateProgress();

        const self = this;
        Draggable.create($proxy, {
            type: 'x',
            trigger: this.wrapperElement,
            throwProps: true,
            force3D: true,
            // allowNativeTouchScrolling: true,
            onDrag: function () { self.updateProgress(this.x, wrapWidth); },
            onThrowUpdate: function () { self.updateProgress(this.x, wrapWidth); },
            onThrowComplete: () => console.log(this.getBoxNumberFromProgress()),
            snap: {
                x: (x) => {
                    let snap = this.gap + ((Math.round(x / this.boxWidth) * this.boxWidth));
                    if (x < snap - this.boxWidth / 2) {
                        snap -= this.boxWidth;
                    }
                    return snap;
                }
            }
        });

        this.scrollTo(20, true);

    }

    private onBoxSelect(boxNum: number, ev: TouchEvent | MouseEvent) {
        if (boxNum !== this.selectedBoxNum) {
            console.log(ev);
            this.scrollTo(boxNum);
        }
    }

    private generateBoxes() {
        for (let i = 1; i <= this.numBoxes; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i.toString();
            box.addEventListener('click', (ev) => this.onBoxSelect(i, ev));
            this.boxesElement.appendChild(box);

            TweenLite.set(box, {
                x: i * this.boxWidth,
                width: this.boxWidth,
                height: this.boxHeight,
                position: 'absolute'
            });

            this.boxes.push(box);
        }
    }

    private recalculateProgress() {
        this.calculatedProgress = [];
        for (let i = 1; i <= this.numBoxes; i++) {
            const progress = this.calculateProgress(i);
            this.calculatedProgress[i] = progress;
            if (!this.gap || progress < this.gap) {
                this.gap = progress;
            }
        }
    }


    private getBoxNumberFromProgress(): number {
        const goal = this.animation.progress();
        const closest = this.calculatedProgress.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
        return this.calculatedProgress.indexOf(closest);
    }

    private scrollTo(boxNumber: number, init: boolean = false) {
        const progress = this.calculateProgress(boxNumber, init);
        if (!this.accumulatedProgress) {
            this.accumulatedProgress += progress;
        } else {
            this.accumulatedProgress += progress - this.animation.progress();
        }
        const config = {
            progress: progress,
            ease: Power3.easeOut,
            onComplete: () => {
                this.selectedBoxNum = boxNumber;
            }
        };
        this.timeline.to(this.animation, 1, config);
    }

    private updateProgress(x: number, wrapWidth: number) {
        x += this.accumulatedProgress * wrapWidth;
        this.animation.progress(x / wrapWidth);
    }

    private calculateProgress(boxNumber: number, init: boolean = false) {
        const boxPercent = (this.numBoxes / Math.pow(this.numBoxes, 2));
        const progress = (boxNumber / this.numBoxes) - (boxPercent * (((this.viewWidth / this.boxWidth) / 2) + 0.5));
        if (init && boxNumber < (this.numBoxes / 2)) {
            return -progress;
        }
        let moveProgress = progress < 0 ? -progress : 1 - progress;
        const current = this.animation.progress();
        if (current && Math.abs(moveProgress - current) > 0.5) {
            moveProgress = current > 0.5 ? 1 + moveProgress : moveProgress - 1;
        }
        return moveProgress;
    }

    render(): JSX.Element {
        return (
            <div>
                <div ref={ref => this.wrapperElement = ref} class="wrapper">
                    <div ref={ref => this.boxesElement = ref} class="boxes"></div>
                </div>
                <div ref={ref => this.viewportElement = ref} class="viewport"></div>
                <div class="mark"></div>
            </div>
        );
    }
}
