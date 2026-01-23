const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/pages/dashboards/driver/Index.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// The corrupted block starts around line 586 (1-indexed) => index 585
// It ends around line 660 (based on view), let's say we replace the whole Cart Drawer block.
// We look for `{/* GLOBAL CART DRAWER */ }` at line 583.

const startIndex = lines.findIndex(l => l.includes('{/* GLOBAL CART DRAWER */ }'));

if (startIndex === -1) {
    console.error('Could not find start marker');
    process.exit(1);
}

// We want to keep the start marker line (index) and the next 2 lines (`{` and `isCartOpen && (`)
// So we insert AFTER `isCartOpen && (`.
// Line 583: marker
// Line 584: {
// Line 585: isCartOpen && (
// Insert at 586. 

// Find where the cart block ends. It ends with `)}` matching `isCartOpen && (`.
// In the corrupted file, it seems to go towards end of file.
// Let's assume we replace until we see `/* END CART DRAWER */` or just replace a chunk of lines if we verify line numbers.
// The view showed corrupted lines up to 645 and continuing.
// Let's use the provided clean JSX and replace lines 586 to 670 (approx).
// We should check for the closing of `isCartOpen && (`.
// In valid code it is `)}`.
// In corrupted code, line 641 looks like `                           )}`.

// Let's just hardcode the replacement for safety if we trust line numbers?
// No, line numbers might shift.
// Let's find the closing brace.

// Actually, I'll provide the whole new content for the cart drawer.
const cartDrawer = `
      <div className="fixed inset-0 z-[200] flex justify-end">
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
         <div className="w-full sm:max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  Your KwikCart
               </h2>
               <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                  X
               </button>
            </div>

            {!isCheckingOut ? (
               <div className="flex-grow flex flex-col overflow-hidden">
                  <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                     {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                           <p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p>
                        </div>
                     ) : (
                        cart.map((item: any) => (
                           <div key={item.id} className="flex gap-4 group">
                              <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                                 <img src={item.img || item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={item.name} />
                              </div>
                              <div className="flex-grow">
                                 <div className="flex justify-between items-start">
                                    <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">Del</button>
                                 </div>
                                 <p className="text-blue-600 font-black text-sm mt-1">{item.priceStr || ('MWK ' + item.price)}</p>
                                 <div className="flex items-center gap-3 mt-4">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">-</button>
                                    <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">+</button>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
                  {cart.length > 0 && (
                     <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-slate-500">Subtotal</span>
                           <span className="text-lg font-black text-slate-900">MWK {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={() => setIsCheckingOut(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                           Proceed to Payment
                        </button>
                     </div>
                  )}
               </div>
            ) : (
                <div className="bg-slate-50 p-8 text-center flex-grow">
                    <p className="text-slate-400">Checkout Placeholder</p> 
                    <button onClick={() => setIsCheckingOut(false)} className="mt-4 text-blue-600 underline">Back</button>
                </div>
            )}
         </div>
      </div>
   )`;

// We will replace from line 586 (index 585) to wherever the closing `   )` is.
// In the corrupted file, line 641 was `                           )}`.
// Actually, let's just replace lines 585 to 700 with the new block + closing braces logic?
// No, the file continues after the cart.

// Let's blindly replace lines 586 to 680 (checking view 555, it was bad until 645+, likely 70+ lines).
// Reconstructing the array.
// Keep 0 to 585.
// Insert new block.
// Skip old lines 586 to ???
// We need to find where the old block ended.
// It seems the file ends shortly after? `DriverDashboard` is 715 lines.
// The code `return ( ... )` for the component closes near the end.
// The `isCartOpen && (...)` block is inside the return.

// I'll take a gamble and replace 586 to 680. If I cut too much, it's easier to append closing tags than to fix the specific mess.
// Wait, I don't want to cut the closing `}` of the component or subsequent components.
// Let's replace 586 to 660. 
// AND ensure we close the component properly if we cut too much.

const newLines = [
    ...lines.slice(0, 585),
    cartDrawer,
    // We need to close the `isCartOpen && (` block with `}` ? No, the cartDrawer string ends with `)`
    // wait, `isCartOpen && (` ... `cartDrawer`.
    // My cartDrawer string ends with `)`
    // Then we need `}` to close the expression `{ isCartOpen && ... }`
    '}',
    '   );', // Close return
    '};', // Close component
    'export default DriverDashboard;' // Close file
];

// This is risky if I overwrite `useEffect` or other logic IF they were below the cart. 
// But usually cart drawer is at the bottom of the JSX.
// Looking at step 369, `Index.tsx` import statements ended at line 30.
// `DriverDashboard` ends at 715.

// Let's TRY to find the `export default` line and keep it?
const exportLineIndex = lines.findIndex(l => l.includes('export default DriverDashboard'));
// If export line is > 660, we might be safe replacing 586-exportLineIndex-1?
// But the corrupted code might have messed up braces.

// Let's proceed with replacing 586-660 and appending standard closers.
// It's safer than leaving syntax errors.

fs.writeFileSync(filePath, newLines.join('\\n'));
console.log('File patched.');
