import { Component, Input, OnInit } from '@angular/core';
import { CarouselImage } from 'src/assets/img/Data/carousel';


@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss'],
})
export class MainCarouselComponent implements OnInit {

  @Input() images: CarouselImage[] = [];
  @Input() indicators = true;
  @Input() controls=true; 
  @Input() autoSlide=false; 
  @Input() slideInterval=3000; 
  ngOnInit(): void {
    if (this.autoSlide) {
      this.autoSlideImages();
    }
  }
  autoSlideImages() {
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval);
  }
  
  constructor() {}

  selectedIndex = 0;
  selectImage(index: number) {
    this.selectedIndex=index;
  }
  onPrevClick(){
    if (this.selectedIndex===0) {
      this.selectedIndex=this.images.length-1
    }else{
      this.selectedIndex--;
    }
  }
  onNextClick(){
    if (this.selectedIndex===this.images.length-1) {
      this.selectedIndex=0
    }else{
      this.selectedIndex++;
    }
  }
}
