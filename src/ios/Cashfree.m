#import "Cashfree.h"

#import <Cordova/CDVAvailability.h>

@implementation Cashfree

- (void)pluginInitialize {
}

- (void)echo:(CDVInvokedUrlCommand *)command {
  NSString* phrase = [command.arguments objectAtIndex:0];
  NSLog(@"%@", phrase);
}


@end
