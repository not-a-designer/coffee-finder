import { NgModule }            from "@angular/core";

import { TruncatePipe }        from '@app-pipes/truncate/truncate.pipe';
import { ReverseTruncatePipe } from '@app-pipes/reverse-truncate/reverse-truncate.pipe';
import { RoundPipe } from './round/round.pipe';


@NgModule({
    declarations: [ TruncatePipe, ReverseTruncatePipe, RoundPipe ],

    exports: [ TruncatePipe, ReverseTruncatePipe, RoundPipe ]
})
export class PipesModule {}