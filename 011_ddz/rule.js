/**
 * 斗地主出牌规则
 *
 * 牌型优先级：火箭 > 炸弹 > 其他（同类型比大小）
 * 同类型必须张数相同才能比较
 * 单牌大小：大王 > 小王 > 2 > A > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3
 */

// ─── 牌型枚举 ────────────────────────────────────────────────────────────────

/**
 * 牌型常量
 * @readonly
 * @enum {number}
 */
const CardType = Object.freeze({
    INVALID:                  0,
    SINGLE:                   1,   // 单张
    TWO:                      2,   // 对子
    THREE:                    3,   // 三张
    THREE_WITH_ONE:           4,   // 三带一
    THREE_WITH_TWO:           5,   // 三带二
    SINGLE_STRAIGHT:          6,   // 单顺（≥5张）
    DOUBLE_STRAIGHT:          7,   // 双顺（≥3对）
    THREE_STRAIGHT:           8,   // 三顺（≥2组）
    THREE_STRAIGHT_WITH_ONE:  9,   // 飞机带单
    THREE_STRAIGHT_WITH_TWO: 10,   // 飞机带对
    FOUR_WITH_TWO:           11,   // 四带二单
    FOUR_WITH_DOUBLE:        12,   // 四带二对
    BOMB:                    13,   // 炸弹
    ROCKET:                  14,   // 火箭（双王）
});

// ─── 牌局规则类 ───────────────────────────────────────────────────────────────

class Rule {

    // ── 静态常量 ────────────────────────────────────────────────────────────────

    /**
     * 54张牌对应的比较值（索引 = 牌编号 0‑53）
     *   花色A  0‑12:  A 2 3 4 5 6 7 8 9 10 J Q K
     *   花色B 13‑25:  同上
     *   花色C 26‑38:  同上
     *   花色D 39‑51:  同上
     *   52 = 小王, 53 = 大王
     *
     * 比较值：3→0, 4→1, …, K→10, A→11, 2→12, 小王→13, 大王→14
     */
    static CARD_VALUE = (() => {
        // 每花色：A=11, 2=12, 3=0, 4=1 … K=10
        const suit = [11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return [...suit, ...suit, ...suit, ...suit, 13, 14];
    })();

    /** 比较值对应的牌面名称 */
    static CARD_LABEL = ['3','4','5','6','7','8','9','10','J','Q','K','A','2','小王','大王'];

    /** 可组成顺子的最大比较值（K=10，不含 2 及王） */
    static STRAIGHT_MAX = 11;

    /** 小王比较值 */
    static JOKER_SMALL = 13;

    /** 大王比较值 */
    static JOKER_BIG = 14;

    // ── 牌值转换 ────────────────────────────────────────────────────────────────

    /**
     * 将手牌编号数组转为比较值数组
     * @param {number[]} cards
     * @returns {number[]}
     */
    toValues(cards) {
        return cards.map(c => Rule.CARD_VALUE[c]);
    }

    /**
     * 将手牌编号数组转为牌面标签数组（调试用）
     * @param {number[]} cards
     * @returns {string[]}
     */
    toLabels(cards) {
        return this.toValues(cards).map(v => Rule.CARD_LABEL[v]);
    }

    // ── 计数排序 ─────────────────────────────────────────────────────────────────

    /**
     * 计数排序：返回长度 15 的二维数组
     * result[v] = [count, card₀, card₁, …]  （v = 比较值 0‑14）
     * @param {number[]} cards
     * @returns {number[][]}
     */
    buildCountArray(cards) {
        const arr = Array.from({ length: 15 }, () => [0, 0, 0, 0, 0]);
        for (const card of cards) {
            const v    = Rule.CARD_VALUE[card];
            const slot = arr[v];
            slot[++slot[0]] = card;
        }
        return arr;
    }

    // ── 取牌 ─────────────────────────────────────────────────────────────────────

    /**
     * 从计数数组中按规格取出牌，同时减少对应计数
     * @param {number[][]} countArr
     * @param {Array<[value: number, count: number]>} spec  如 [[v1,n1],[v2,n2],…]
     * @returns {number[]}
     */
    pickCards(countArr, spec) {
        const result = [];
        for (const [v, n] of spec) {
            const slot = countArr[v];
            for (let j = slot[0]; j > slot[0] - n; j--) {
                result.push(slot[j]);
            }
            slot[0] -= n;
        }
        return result;
    }

    // ── 牌型识别 ─────────────────────────────────────────────────────────────────

    /**
     * 获取出牌的类型及最大比较值
     * @param {number[]} values    经 toValues() 转换后的数组
     * @param {number[][]} countArr  经 buildCountArray() 得到的数组
     * @returns {{ type: number, maxNum: number }}
     */
    getCardsType(values, countArr) {
        const INVALID = { type: CardType.INVALID, maxNum: 0 };
        const len = values.length;

        // ── 1‑3 张快速判断 ──
        if (len === 1)
            return { type: CardType.SINGLE, maxNum: values[0] };

        if (len === 2) {
            if (values[0] === values[1])
                return { type: CardType.TWO, maxNum: values[0] };
            if (countArr[Rule.JOKER_SMALL][0] === 1 && countArr[Rule.JOKER_BIG][0] === 1)
                return { type: CardType.ROCKET, maxNum: Rule.JOKER_BIG };
            return INVALID;
        }

        if (len === 3) {
            const v = values[0];
            if (v === values[1] && v === values[2])
                return { type: CardType.THREE, maxNum: v };
            return INVALID;
        }

        // ── 统计各张数的组数及顺子信息 ──
        // groupCount[n] = 恰好有 n 张的面值数
        // straight[n]   = 当前连续 n 张一组的顺子长度
        // maxVal[n]     = n 张一组中最大面值
        const groupCount = [0, 0, 0, 0, 0];
        const straight   = [0, 0, 0, 0, 0];
        const prevVal    = [-1, -1, -1, -1, -1];
        const maxVal     = [0, 0, 0, 0, 0];

        for (let i = 0; i < countArr.length; i++) {
            const n = countArr[i][0];
            if (n === 0) continue;

            groupCount[n]++;

            if (prevVal[n] < 0) {
                prevVal[n]  = i;
                straight[n] = 1;
            } else if (i - 1 === prevVal[n] && i <= Rule.STRAIGHT_MAX) {
                straight[n]++;
                prevVal[n] = i;
            } else {
                straight[n] = 0;
            }

            maxVal[n] = i;
        }

        const [g1, g2, g3, g4] = [groupCount[1], groupCount[2], groupCount[3], groupCount[4]];
        const [s1, s2, s3]     = [straight[1],   straight[2],   straight[3]];
        const [m1, m2, m3, m4] = [maxVal[1],     maxVal[2],     maxVal[3],    maxVal[4]];

        // ── 炸弹系列 ──
        if (g4 > 1) return INVALID;

        if (g4 === 1) {
            if (len === 4)                            return { type: CardType.BOMB,             maxNum: m4 };
            if ((g1 === 2 || g2 === 1) && g3 === 0)  return { type: CardType.FOUR_WITH_TWO,    maxNum: m4 };
            if (g2 === 2 && g1 + g3 === 0)           return { type: CardType.FOUR_WITH_DOUBLE, maxNum: m4 };
            return INVALID;
        }

        // ── 三带 ──
        if (g3 === 1) {
            if (g2 === 1 && g1 === 0) return { type: CardType.THREE_WITH_TWO, maxNum: m3 };
            if (g1 === 1 && g2 === 0) return { type: CardType.THREE_WITH_ONE, maxNum: m3 };
            return INVALID;
        }

        // ── 顺子系列 ──
        if (s1 >= 5 && g1 === s1 && g2 + g3 === 0)
            return { type: CardType.SINGLE_STRAIGHT, maxNum: m1 };

        if (s2 >= 3 && g2 === s2 && g1 + g3 === 0)
            return { type: CardType.DOUBLE_STRAIGHT, maxNum: m2 };

        if (s3 >= 2 && g3 === s3) {
            if (g1 + g2 === 0)         return { type: CardType.THREE_STRAIGHT,          maxNum: m3 };
            if (s3 === g1 + g2 * 2)    return { type: CardType.THREE_STRAIGHT_WITH_ONE, maxNum: m3 };
            if (g2 === g3 && g1 === 0) return { type: CardType.THREE_STRAIGHT_WITH_TWO, maxNum: m3 };
        }

        return INVALID;
    }

    // ── AI 出牌（需要压牌） ───────────────────────────────────────────────────────

    /**
     * 压制上家出牌
     * @param {number[][]} hand
     * @param {number[]}   handCards
     * @param {number}     prevType
     * @param {number}     prevMax
     * @param {number}     prevLen
     * @param {number[]}   bombPositions
     * @param {boolean}    hasRocket
     * @returns {number[] | undefined}
     */
    playToBeat(hand, handCards, prevType, prevMax, prevLen, bombPositions, hasRocket) {
        if (prevType === CardType.ROCKET) return undefined;

        // ── 单 / 对 / 三张 ──
        if (prevType <= CardType.THREE) {
            const needed = prevType;
            let splitPos = -1;

            for (let i = 0; i < hand.length; i++) {
                const n = hand[i][0];
                if (n === 4 || i <= prevMax) continue;

                if (n === needed) {
                    // [优化] 取消对王牌的特殊保留，直接出
                    return this.pickCards(hand, [[i, needed]]);
                }

                // [优化] n >= needed 均可记录拆牌位，不再排除王牌槽
                if (n > needed && splitPos === -1) {
                    splitPos = i;
                }
            }

            if (splitPos >= 0) return this.pickCards(hand, [[splitPos, needed]]);
            return undefined;
        }

        // ── 三带一 / 三带二 ──
        if (prevType <= CardType.THREE_WITH_TWO) {
            let p3 = -1, p1 = -1, p2 = -1;

            for (let i = 0; i < hand.length; i++) {
                const n = hand[i][0];
                if (n === 4) continue;
                if (p3 === -1 && n === 3 && i > prevMax) { p3 = i; continue; }
                if (p1 === -1 && n === 1 && i < 13)       { p1 = i; continue; }
                if (p2 === -1 && n === 2 && i < 13)       { p2 = i; continue; }
            }

            if (p3 >= 12) return undefined;

            if (prevType === CardType.THREE_WITH_ONE && p3 >= 0 && p1 >= 0)
                return this.pickCards(hand, [[p3, 3], [p1, 1]]);

            if (prevType === CardType.THREE_WITH_TWO && p3 >= 0 && p2 >= 0)
                return this.pickCards(hand, [[p3, 3], [p2, 2]]);

            return undefined;
        }

        // ── 单顺 / 双顺 / 三顺 ──
        if (prevType <= CardType.THREE_STRAIGHT) {
            const size     = prevType - CardType.SINGLE_STRAIGHT + 1;
            const groupLen = prevLen / size;
            const minStart = prevMax - groupLen + 2;

            let runLen = 1;
            for (let i = 1; i < hand.length; i++) {
                const n = hand[i][0];
                if (n === 4) { runLen = 1; continue; }

                if (i > minStart && i <= Rule.STRAIGHT_MAX && n === size && hand[i - 1][0] === size) {
                    if (++runLen === groupLen) {
                        const spec = [];
                        for (let j = i - runLen + 1; j <= i; j++) spec.push([j, size]);
                        return this.pickCards(hand, spec);
                    }
                } else {
                    runLen = 1;
                }
            }
            return undefined;
        }

        // ── 飞机带单 / 飞机带对 ──
        if (prevType <= CardType.THREE_STRAIGHT_WITH_TWO) {
            const withSize = prevType === CardType.THREE_STRAIGHT_WITH_TWO ? 2 : 1;
            const groupLen = prevType === CardType.THREE_STRAIGHT_WITH_TWO ? prevLen / 5 : prevLen / 4;
            const minStart = prevMax - groupLen + 2;

            let runLen = 1;
            const mainSpec = [];
            for (let i = 1; i < 12; i++) {
                const n = hand[i][0];
                if (n === 4) { runLen = 1; continue; }

                if (i > minStart && n === 3 && hand[i - 1][0] === 3) {
                    if (++runLen === groupLen) {
                        for (let j = i - runLen + 1; j <= i; j++) mainSpec.push([j, 3]);
                        break;
                    }
                } else {
                    runLen = 1;
                }
            }

            if (mainSpec.length < groupLen) return undefined;

            const mainRange     = new Set(mainSpec.map(([v]) => v));
            const withPositions = [];
            for (let i = 0; i < 15; i++) {
                if (mainRange.has(i)) continue;
                const n = hand[i][0];
                if (n === 4 || n < withSize) continue;
                withPositions.push(i);
                if (withPositions.length >= groupLen) break;
            }

            if (withPositions.length >= groupLen) {
                const spec = [...mainSpec, ...withPositions.slice(0, groupLen).map(v => [v, withSize])];
                return this.pickCards(hand, spec);
            }

            return undefined;
        }

        return undefined;
    }

    // ── AI 出牌（自由出牌） ──────────────────────────────────────────────────────

    /**
     * 自由出牌
     * @param {number[][]} hand
     * @param {number[]}   handCards
     * @param {number[]}   bombPositions
     * @param {boolean}    hasRocket
     * @returns {number[]}
     */
    playFree(hand, handCards, bombPositions, hasRocket) {
        let p1 = -1, p2 = -1, p3 = -1;

        // [优化] 将顺子检测独立出来，避免 runStart/runSize 被提前覆盖
        // 先扫一遍找最优顺子
        let bestRunStart = -1, bestRunCount = 0, bestRunSize = 0;
        let runStart = 0, runCount = 1, runSize = hand[0][0];

        for (let i = 1; i < hand.length; i++) {
            const n = hand[i][0];

            if (n > 0 && i < 12 && i - runCount === runStart && n === hand[i - 1][0]) {
                runCount++;
            } else {
                // 检查上一段顺子是否成立
                if ((runSize === 1 && runCount >= 5) || (runSize === 2 && runCount >= 3)) {
                    if (bestRunStart < 0) {
                        bestRunStart = runStart;
                        bestRunCount = runCount;
                        bestRunSize  = runSize;
                    }
                }
                runStart = i;
                runCount = 1;
                runSize  = n;
            }
        }
        // 检查最后一段
        if ((runSize === 1 && runCount >= 5) || (runSize === 2 && runCount >= 3)) {
            if (bestRunStart < 0) {
                bestRunStart = runStart;
                bestRunCount = runCount;
                bestRunSize  = runSize;
            }
        }

        if (bestRunStart >= 0) {
            const spec = Array.from({ length: bestRunCount }, (_, k) => [bestRunStart + k, bestRunSize]);
            return this.pickCards(hand, spec);
        }

        // 单/对/三扫描
        for (let i = 0; i < hand.length; i++) {
            const n = hand[i][0];
            if (n === 1 && p1 === -1) p1 = i;
            if (n === 2 && p2 === -1) p2 = i;
            if (n === 3 && p3 === -1) p3 = i;
        }

        // 三带（优先出较小面值，不带王）
        if (p3 >= 0 && (p3 < 11 || handCards.length < 10)) {
            if (p1 >= 0 && p1 < 13) {
                const withPos = (p2 >= 0 && p2 < p1) ? p2 : p1;
                return this.pickCards(hand, [[p3, 3], [withPos, hand[withPos][0]]]);
            }
            if (p2 >= 0) return this.pickCards(hand, [[p3, 3], [p2, 2]]);
        }

        // 单张或对子（非王）
        if (p1 >= 0 && p1 < 13) {
            const pos = (p2 >= 0 && p2 < p1) ? p2 : p1;
            return this.pickCards(hand, [[pos, hand[pos][0]]]);
        }

        if (p2 >= 0) return this.pickCards(hand, [[p2, 2]]);
        if (p3 >= 0) return this.pickCards(hand, [[p3, 3]]);

        // [优化] 直接出炸弹，不检查条件
        if (bombPositions.length > 0)
            return this.pickCards(hand, [[bombPositions[0], 4]]);

        // [优化] 直接出火箭，不检查条件
        if (hasRocket)
            return this.pickCards(hand, [[Rule.JOKER_SMALL, 1], [Rule.JOKER_BIG, 1]]);

        if (hand[Rule.JOKER_SMALL][0] > 0) return this.pickCards(hand, [[Rule.JOKER_SMALL, 1]]);
        if (hand[Rule.JOKER_BIG][0]   > 0) return this.pickCards(hand, [[Rule.JOKER_BIG,   1]]);

        return [];
    }


    /**
     * 出牌
     * @param {number[]} handCards  本家手牌编号数组
     * @param {number[]} prevCards  上家出牌编号数组（空则自由出牌）
     * @returns {number[] | undefined}  出牌数组，undefined 表示不出
     */
    outOfCards(handCards, prevCards = []) {
        const hand    = this.buildCountArray(handCards);
        const prevLen = prevCards.length;
        const { type: prevType, maxNum: prevMax } =
            this.getCardsType(this.toValues(prevCards), this.buildCountArray(prevCards));

        // 预先收集炸弹与火箭信息
        const bombPositions = [];
        for (let i = 0; i < 13; i++) {
            if (hand[i][0] === 4) bombPositions.push(i);
        }
        const hasRocket = hand[Rule.JOKER_SMALL][0] === 1 && hand[Rule.JOKER_BIG][0] === 1;

        // ── 需要压牌 ──
        if (prevLen > 0) {
            const result = this.playToBeat(
                hand, handCards, prevType, prevMax, prevLen, bombPositions, hasRocket
            );
            if (result !== undefined) return result;

            // 常规压制失败，尝试火箭 / 炸弹，不保留
            if (hasRocket)
                return this.pickCards(hand, [[Rule.JOKER_SMALL, 1], [Rule.JOKER_BIG, 1]]);

            if (bombPositions.length > 0) {
                // 若上家也是炸弹则需比大小，否则直接出最小炸弹
                if (prevType === CardType.BOMB && prevMax >= bombPositions[0]) {
                    // 找一个比上家大的炸弹
                    const bigger = bombPositions.find(v => v > prevMax);
                    if (bigger !== undefined)
                        return this.pickCards(hand, [[bigger, 4]]);
                    return undefined;
                }
                return this.pickCards(hand, [[bombPositions[0], 4]]);
            }

            return undefined;
        }

        // ── 自由出牌 ──
        return this.playFree(hand, handCards, bombPositions, hasRocket);
    }
}
