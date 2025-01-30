import { setLogger } from "../../logger/src/logger";
import { TestLogger } from "../../test/src/test-logger";
import { trace } from "./trace";

describe('run with trace', () => {

  const logger = new TestLogger();

  const BEGIN_TRACE = '[%s] Starting trace';
  const PARENT_TRACE = '[%s] Parent: %s';
  const STARTING_OP = 'starting trace';
  const ENDING_OP = 'ending trace';

  beforeAll(() => {
    setLogger(logger)
  })

  beforeEach(() => {
    logger.reset()
  })

  it('should track correctly when is first trace', async () => {
    const result = await trace('test', async () => {
      return true
    })
    expect(result).toBe(true)
    expect(logger.getCalls().length).toBe(4)
    expect(logger.getCalls()[0]).toMatchObject({msg: BEGIN_TRACE, args: ['test']})
    expect(logger.getCalls()[1]).toMatchObject({msg: PARENT_TRACE, args: ['test', undefined]})
    expect(logger.getCalls()[2]).toMatchObject({msg: STARTING_OP})
    expect(logger.getCalls()[3]).toMatchObject({msg: ENDING_OP})
  });

  it('should track correctly when is nested trace', async () => {
    const op1 = async () => {
      return await trace("op1", async () => {
        return await op2()
      })
    }

    const op2 = async () => {
      return await trace("op2", async () => {
        return "op2"
      })
    }

    const result = await op1()
    expect(result).toBe("op2")
    expect(logger.getCalls().length).toBe(8)
    expect(logger.getCalls()[0]).toMatchObject({msg: BEGIN_TRACE, args: ['op1']})
    expect(logger.getCalls()[1]).toMatchObject({msg: PARENT_TRACE, args: ['op1', undefined]})
    expect(logger.getCalls()[2]).toMatchObject({msg: STARTING_OP, args: ['op1']})

    expect(logger.getCalls()[3]).toMatchObject({msg: BEGIN_TRACE, args: ['op2']})
    expect(logger.getCalls()[4]).toMatchObject({msg: PARENT_TRACE, args: ['op2', 'op1']})
    expect(logger.getCalls()[5]).toMatchObject({msg: STARTING_OP, args: ['op2']})
    expect(logger.getCalls()[6]).toMatchObject({msg: ENDING_OP, args: ['op2']})

    expect(logger.getCalls()[7]).toMatchObject({msg: ENDING_OP, args: ['op1']})
  });

  it('should track correctly when is multiple trace in same level', async () => {
    const op = async () => {
      await trace("op1", async () => {
        return "op1"
      })
      await trace("op2", async () => {
        return "op2"
      })
      return "ok"
    }

    const result = await trace("op", op)
    expect(result).toBe("ok")
    expect(logger.getCalls().length).toBe(12)

    expect(logger.getCalls()[0]).toMatchObject({msg: BEGIN_TRACE, args: ['op']})
    expect(logger.getCalls()[1]).toMatchObject({msg: PARENT_TRACE, args: ['op', undefined]})
    expect(logger.getCalls()[2]).toMatchObject({msg: STARTING_OP, args: ['op']})

    expect(logger.getCalls()[3]).toMatchObject({msg: BEGIN_TRACE, args: ['op1']})
    expect(logger.getCalls()[4]).toMatchObject({msg: PARENT_TRACE, args: ['op1', 'op']})
    expect(logger.getCalls()[5]).toMatchObject({msg: STARTING_OP, args: ['op1']})
    expect(logger.getCalls()[6]).toMatchObject({msg: ENDING_OP, args: ['op1']})

    expect(logger.getCalls()[7]).toMatchObject({msg: BEGIN_TRACE, args: ['op2']})
    expect(logger.getCalls()[8]).toMatchObject({msg: PARENT_TRACE, args: ['op2', 'op']})
    expect(logger.getCalls()[9]).toMatchObject({msg: STARTING_OP, args: ['op2']})
    expect(logger.getCalls()[10]).toMatchObject({msg: ENDING_OP, args: ['op2']})

    expect(logger.getCalls()[11]).toMatchObject({msg: ENDING_OP, args: ['op']})
  });

  it('should track correctly when is multiple nested traces in parallel', async () => {
    const op = async () => {
      return await trace("op", async () => {
        const ops: Promise<String>[] = []

        for (let i = 0; i < 10; i++) {
          ops.push(trace(`op${i}`, async () => {
            return `op${i}`
          }))
        }

        await Promise.all(ops)
        return "ok"
      })
    }

    const result = await op()
    expect(result).toBe("ok")

    expect(logger.getCalls()[0]).toMatchObject({msg: BEGIN_TRACE, args: ['op']})
    expect(logger.getCalls()[1]).toMatchObject({msg: PARENT_TRACE, args: ['op', undefined]})
    expect(logger.getCalls()[2]).toMatchObject({msg: STARTING_OP, args: ['op']})

    for (let i = 0; i < 10; i++) {
      const groupIndex = 3 * (i + 1)
      expect(logger.getCalls()[groupIndex]).toMatchObject({msg: BEGIN_TRACE, args: [`op${i}`]})
      expect(logger.getCalls()[groupIndex + 1]).toMatchObject({msg: PARENT_TRACE, args: [`op${i}`, 'op']})
      expect(logger.getCalls()[groupIndex + 2]).toMatchObject({msg: STARTING_OP, args: [`op${i}`]})
    }

    for (let i = 0; i < 10; i++) {
      expect(logger.getCalls()[33 + i]).toMatchObject({msg: ENDING_OP, args: [`op${i}`]})
    }

    expect(logger.getCalls()[43]).toMatchObject({msg: ENDING_OP, args: ['op']})
  });
})  
