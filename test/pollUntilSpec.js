import { expect } from 'chai';
import pollUntil from '../src/pollUntil';

describe('pollUntil', () => {
  it('throws error when polling function is missing', () => {
    expect(pollUntil).to.throw(Error);
  });

  context('when poller is satisfied on time', () => {
    it('returns a promise passing "true" as its first argument', (done) => {
      pollUntil(flag => flag === true, [true])
        .then((result) => {
          expect(result).to.be.true;
          done();
        });
    });
  });

  context('when timebomb goes off', () => {
    it('returns a promise passing "false" as its first argument', (done) => {
      pollUntil(flag => flag === true, [false], 1)
        .then((result) => {
          expect(result).to.be.false;
          done();
        });
    });
  });

  context('when error occurs while polling', () => {
    it('throws the raised error', (done) => {
      pollUntil(() => { throw new Error('Boom!'); }, 100, 10)
        .catch((err) => {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.eq('Error: Boom!');
          done();
        });
    });
  });
});
