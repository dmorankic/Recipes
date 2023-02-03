import { Directive, ElementRef, Renderer2, HostListener,
    HostBinding} from "@angular/core";

@Directive({
    selector:'[appDropdown]'
})

export class DropdownDirective {
    private clicked:boolean=false;
    //MY SOLUTION
    // constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    // @HostListener('click') click() {
    //    if(!this.clicked){
    //     this.renderer.addClass(this.elRef.nativeElement, 'open')
    //    } else {
    //     this.renderer.removeClass(this.elRef.nativeElement, 'open')
    //    }
    //    this.clicked=!this.clicked
    //   }


        //MAXIMILIAN SOLUTION
    // @HostBinding('class.open') isOpen = false;
    // @HostListener('click') click() { this.isOpen=!this.isOpen}

        //MAXIMILIAN CLICK ANYWHERE TO CLOSE SOLUTION
        @HostBinding('class.open') isOpen = false;
        @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
            this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
          }
          constructor(private elRef: ElementRef) {}
        
}