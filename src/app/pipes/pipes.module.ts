import { NgModule }            from "@angular/core";

import { TruncatePipe }        from '@app-pipes/truncate/truncate.pipe';
import { ReverseTruncatePipe } from '@app-pipes/reverse-truncate/reverse-truncate.pipe';
import { RoundPipe }           from './round/round.pipe';
import { SanitizeHtmlPipe }    from './sanitize-html/sanitize-html.pipe';
import { SanitizeDirectionsPipe } from './sanitize-directions/sanitize-directions.pipe';


@NgModule({
    declarations: [ 
        TruncatePipe, 
        ReverseTruncatePipe, 
        RoundPipe, 
        SanitizeHtmlPipe,
        SanitizeDirectionsPipe 
    ],

    exports: [ 
        TruncatePipe, 
        ReverseTruncatePipe, 
        RoundPipe,
        SanitizeHtmlPipe,
        SanitizeDirectionsPipe
    ]
})
export class PipesModule {}