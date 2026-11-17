import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PlatformRequestScope} from '../src/lib/platform-request-scope.mjs';

test('workspace change prevents a slow earlier response from overwriting the new workspace',async()=>{
 const scope=new PlatformRequestScope();let rendered;let oldResolve;
 const oldEpoch=scope.current();const oldResponse=new Promise(resolve=>{oldResolve=resolve;});
 const apply=oldResponse.then(value=>{if(scope.isCurrent(oldEpoch))rendered=value;});
 scope.reset();rendered='workspace B';oldResolve('workspace A');await apply;
 assert.equal(rendered,'workspace B');
});
test('logout invalidates pending key-generation and payment responses',()=>{
 const scope=new PlatformRequestScope();const keyRequest=scope.current();scope.reset();
 assert.equal(scope.isCurrent(keyRequest),false);
});
test('double submission is blocked until the current operation finishes',()=>{
 const scope=new PlatformRequestScope();const first=scope.beginMutation();assert.notEqual(first,null);
 assert.equal(scope.beginMutation(),null);assert.equal(scope.finishMutation(first),true);assert.notEqual(scope.beginMutation(),null);
});
test('an old mutation completion cannot release a newer workspace operation',()=>{
 const scope=new PlatformRequestScope();const old=scope.beginMutation();scope.reset();const current=scope.beginMutation();
 assert.equal(scope.finishMutation(old),false);assert.equal(scope.isBusy(),true);assert.equal(scope.finishMutation(current),true);
});

test('account identity change invalidates pending responses before an effect runs',()=>{
 let identity='account A';const scope=new PlatformRequestScope(()=>identity);const old=scope.current();identity='account B';
 assert.equal(scope.isCurrent(old),false);const next=scope.beginMutation();assert.notEqual(next,old);assert.equal(scope.isCurrent(next),true);
});
