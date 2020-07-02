#import <Cordova/CDVPlugin.h>

@interface Cashfree : CDVPlugin {
}

// The hooks for our plugin commands
- (void)echo:(CDVInvokedUrlCommand *)command;

@end
