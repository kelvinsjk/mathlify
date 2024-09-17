PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `techniques` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`section` text NOT NULL,
	`subsection` text NOT NULL,
	`variant` integer
);
INSERT INTO techniques VALUES('functions/concepts/intervals','functions','concepts','intervals',NULL);
INSERT INTO techniques VALUES('functions/concepts/domain-and-range/1','functions','concepts','domain-and-range',1);
INSERT INTO techniques VALUES('functions/concepts/domain-and-range/2','functions','concepts','domain-and-range',2);
INSERT INTO techniques VALUES('functions/inverse/existence','functions','inverse','existence',NULL);
INSERT INTO techniques VALUES('functions/inverse/domain','functions','inverse','domain',NULL);
INSERT INTO techniques VALUES('functions/inverse/formula','functions','inverse','formula',NULL);
INSERT INTO techniques VALUES('functions/inverse/restriction','functions','inverse','restriction',NULL);
INSERT INTO techniques VALUES('functions/inverse/relationship/1','functions','inverse','relationship',1);
INSERT INTO techniques VALUES('functions/inverse/relationship/2','functions','inverse','relationship',2);
INSERT INTO techniques VALUES('functions/composite/existence','functions','composite','existence',NULL);
INSERT INTO techniques VALUES('functions/composite/formula','functions','composite','formula',NULL);
INSERT INTO techniques VALUES('functions/composite/range','functions','composite','range',NULL);
INSERT INTO techniques VALUES('functions/composite/self-compose','functions','composite','self-compose',NULL);
INSERT INTO techniques VALUES('functions/composite/compose-inverse','functions','composite','compose-inverse',NULL);
INSERT INTO techniques VALUES('functions/more/self-inverse','functions','more','self-inverse',NULL);
INSERT INTO techniques VALUES('functions/more/piecewise','functions','more','piecewise',NULL);
INSERT INTO techniques VALUES('functions/more/modulus','functions','more','modulus',NULL);
INSERT INTO techniques VALUES('functions/more/discriminant','functions','more','discriminant',NULL);
CREATE TABLE IF NOT EXISTS `tys_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`paper` integer NOT NULL,
	`question` integer NOT NULL,
	`part` integer NOT NULL,
	`subpart` integer
);
INSERT INTO tys_questions VALUES('2019/p1/q5/a',2019,1,5,1,NULL);
INSERT INTO tys_questions VALUES('2019/p1/q5/b',2019,1,5,2,NULL);
INSERT INTO tys_questions VALUES('2014/p1/q1/a',2014,1,1,1,NULL);
INSERT INTO tys_questions VALUES('2014/p1/q1/b',2014,1,1,2,NULL);
INSERT INTO tys_questions VALUES('2021/p2/q3/a/i',2021,2,3,1,1);
INSERT INTO tys_questions VALUES('2021/p2/q3/a/ii',2021,2,3,1,2);
INSERT INTO tys_questions VALUES('2021/p2/q3/b/i',2021,2,3,2,1);
INSERT INTO tys_questions VALUES('2021/p2/q3/b/ii',2021,2,3,2,2);
INSERT INTO tys_questions VALUES('2021/p2/q3/b/iii',2021,2,3,2,3);
INSERT INTO tys_questions VALUES('2016/p1/q10/a/i',2016,1,10,1,1);
INSERT INTO tys_questions VALUES('2016/p1/q10/a/ii',2016,1,10,1,2);
INSERT INTO tys_questions VALUES('2016/p1/q10/b/i',2016,1,10,2,1);
INSERT INTO tys_questions VALUES('2016/p1/q10/b/ii',2016,1,10,2,2);
INSERT INTO tys_questions VALUES('2018/p1/q5',2018,1,5,0,NULL);
INSERT INTO tys_questions VALUES('2015/p2/q3/a/i',2015,2,3,1,1);
INSERT INTO tys_questions VALUES('2015/p2/q3/a/ii',2015,2,3,1,2);
INSERT INTO tys_questions VALUES('2015/p2/q3/b',2015,2,3,2,NULL);
INSERT INTO tys_questions VALUES('2017/p2/q3/a/i',2017,2,3,1,1);
INSERT INTO tys_questions VALUES('2017/p2/q3/a/ii',2017,2,3,1,2);
INSERT INTO tys_questions VALUES('2017/p2/q3/a/iii',2017,2,3,1,3);
INSERT INTO tys_questions VALUES('2017/p2/q3/a/iv',2017,2,3,1,4);
INSERT INTO tys_questions VALUES('2017/p2/q3/b/i',2017,2,3,2,1);
INSERT INTO tys_questions VALUES('2017/p2/q3/b/ii',2017,2,3,2,2);
INSERT INTO tys_questions VALUES('2017/p2/q3/b/iii',2017,2,3,2,3);
INSERT INTO tys_questions VALUES('2007/p1/q2/a',2007,1,2,1,NULL);
INSERT INTO tys_questions VALUES('2007/p1/q2/b',2007,1,2,2,NULL);
INSERT INTO tys_questions VALUES('2008/p2/q4/a',2008,2,4,1,NULL);
INSERT INTO tys_questions VALUES('2008/p2/q4/b',2008,2,4,2,NULL);
INSERT INTO tys_questions VALUES('2008/p2/q4/c',2008,2,4,3,NULL);
INSERT INTO tys_questions VALUES('2008/p2/q4/d',2008,2,4,4,NULL);
INSERT INTO tys_questions VALUES('2009/p2/q3/a',2009,2,3,1,NULL);
INSERT INTO tys_questions VALUES('2009/p2/q3/b',2009,2,3,2,NULL);
INSERT INTO tys_questions VALUES('2009/p2/q3/c',2009,2,3,3,NULL);
INSERT INTO tys_questions VALUES('2010/p2/q4/a',2010,2,4,1,NULL);
INSERT INTO tys_questions VALUES('2010/p2/q4/b',2010,2,4,2,NULL);
INSERT INTO tys_questions VALUES('2010/p2/q4/c',2010,2,4,3,NULL);
INSERT INTO tys_questions VALUES('2010/p2/q4/d',2010,2,4,4,NULL);
INSERT INTO tys_questions VALUES('2010/p2/q4/e',2010,2,4,5,NULL);
INSERT INTO tys_questions VALUES('2011/p2/q3/a',2011,2,3,1,NULL);
INSERT INTO tys_questions VALUES('2011/p2/q3/b',2011,2,3,2,NULL);
INSERT INTO tys_questions VALUES('2011/p2/q3/c',2011,2,3,3,NULL);
INSERT INTO tys_questions VALUES('2012/p1/q7/a',2012,1,7,1,NULL);
INSERT INTO tys_questions VALUES('2012/p1/q7/b',2012,1,7,2,NULL);
INSERT INTO tys_questions VALUES('2012/p1/q7/c',2012,1,7,3,NULL);
INSERT INTO tys_questions VALUES('2013/p2/q1/a',2013,2,1,1,NULL);
INSERT INTO tys_questions VALUES('2013/p2/q1/b',2013,2,1,2,NULL);
INSERT INTO tys_questions VALUES('2022/p1/q6/a',2022,1,6,1,NULL);
INSERT INTO tys_questions VALUES('2022/p1/q6/b',2022,1,6,2,NULL);
INSERT INTO tys_questions VALUES('2022/p1/q6/c',2022,1,6,3,NULL);
INSERT INTO tys_questions VALUES('2022/p1/q6/d',2022,1,6,4,NULL);
INSERT INTO tys_questions VALUES('2023/p1/q7/a',2023,1,7,1,NULL);
INSERT INTO tys_questions VALUES('2023/p1/q7/b',2023,1,7,2,NULL);
INSERT INTO tys_questions VALUES('2023/p1/q7/c',2023,1,7,3,NULL);
INSERT INTO tys_questions VALUES('2023/p1/q7/d',2023,1,7,4,NULL);
INSERT INTO tys_questions VALUES('2023/p1/q7/e',2023,1,7,5,NULL);
CREATE TABLE IF NOT EXISTS `tys_questions_to_techniques` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text,
	`technique` text,
	FOREIGN KEY (`question`) REFERENCES `tys_questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`technique`) REFERENCES `techniques`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO tys_questions_to_techniques VALUES('kw2c6zpflkrh6fok6pf4q58f','2021/p2/q3/a/i','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('eqid0ldn5oeag4e65dg1yr1k','2021/p2/q3/b/i','functions/concepts/domain-and-range/2');
INSERT INTO tys_questions_to_techniques VALUES('znf1qm5f69irk1g1jhxowzob','2021/p2/q3/b/ii','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('i7g04fycw12c57espuneazai','2019/p1/q5/a','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('e56if4lipdyfy7jj044p06pv','2019/p1/q5/a','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('v10ogkbuyj6l5bz1pokzhcq9','2019/p1/q5/b','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('hhl1hgw5dlopiuqgneku3dzi','2018/p1/q5','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('iirg9rld2mhyr20holq1ahb6','2018/p1/q5','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('vjnami07rae5u4vngwwm7bv6','2017/p2/q3/a/iv','functions/inverse/relationship/2');
INSERT INTO tys_questions_to_techniques VALUES('tnm2fz9o2bnm7j2l6s25vi9h','2017/p2/q3/b/i','functions/concepts/domain-and-range/2');
INSERT INTO tys_questions_to_techniques VALUES('chah7rfcj0lr9sxk2vgdkpgn','2017/p2/q3/b/ii','functions/composite/self-compose');
INSERT INTO tys_questions_to_techniques VALUES('uvd3shxydhcph7h4ad3mja5y','2017/p2/q3/b/ii','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('fxhw162ti1xiyvcqho42hna2','2016/p1/q10/a/i','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('cjs2gwx1eu3iq7mkdqzkxsqn','2016/p1/q10/a/i','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('khwk2guyp08r6lbb9np53f15','2016/p1/q10/a/ii','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('jczst5e7fz3cn79jgpwvwbn5','2016/p1/q10/a/ii','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('myxkspn7zhth4p3wi16x3cp0','2016/p1/q10/b/i','functions/more/piecewise');
INSERT INTO tys_questions_to_techniques VALUES('ttqyjy9kd95kdc0nnkovcmz1','2015/p2/q3/a/i','functions/inverse/existence');
INSERT INTO tys_questions_to_techniques VALUES('znottzsbt0mgf568k69xrwks','2015/p2/q3/a/ii','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('wvrp4r3w9t3mlqbg1e0flcuo','2015/p2/q3/a/ii','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('z3f35ambyezgy6zsk9kcv6rl','2015/p2/q3/b','functions/more/discriminant');
INSERT INTO tys_questions_to_techniques VALUES('s35ocv1e09nz86s7ahu1d5vo','2014/p1/q1/a','functions/composite/self-compose');
INSERT INTO tys_questions_to_techniques VALUES('nvnqibd04sh46mhcapaw38zo','2014/p1/q1/a','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('y740a5au83i8igszragwqr36','2014/p1/q1/b','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('ubysrpgz9kvucrds4gz2okf4','2007/p1/q2/a','functions/composite/existence');
INSERT INTO tys_questions_to_techniques VALUES('oixuhe9fp8lzy1tz4vosvr5p','2007/p1/q2/a','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('pog4llzg03uy81suqnn9t2yv','2007/p1/q2/b','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('hou02iuc2ybq4ktv88kv8k9h','2007/p1/q2/b','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('ckrvrvhb50athpox1kovoe3l','2008/p2/q4/b','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('ti74fi36h4mk1tcngpjxga89','2008/p2/q4/b','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('ja7ykxny5h33ygkyraylmrs7','2008/p2/q4/d','functions/inverse/relationship/1');
INSERT INTO tys_questions_to_techniques VALUES('fkdjkzom6gt7kr38fnd4cg90','2009/p2/q3/a','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('c1gxmrc9sjpn9ojxh74lu80d','2009/p2/q3/a','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('c6y4ns2por767jiwx4kacp2y','2009/p2/q3/a','functions/concepts/domain-and-range/1');
INSERT INTO tys_questions_to_techniques VALUES('sm5q39r5q4j0r3s8maucbf7c','2009/p2/q3/b','functions/composite/existence');
INSERT INTO tys_questions_to_techniques VALUES('wmp7etlxk55zi9wefgjqh0yr','2010/p2/q4/b','functions/inverse/restriction');
INSERT INTO tys_questions_to_techniques VALUES('iw2iru1dancfaztat153cre2','2010/p2/q4/c','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('u7dkznxvgqlbbbxk0lkuz4do','2010/p2/q4/e','functions/composite/range');
INSERT INTO tys_questions_to_techniques VALUES('qd3vw1vxbihvuswhebtnio1r','2011/p2/q3/a','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('ttju9yjrftdtqjuw8lxmq0kj','2011/p2/q3/a','functions/inverse/domain');
INSERT INTO tys_questions_to_techniques VALUES('swuwhq97zml59ujh12hk01h0','2011/p2/q3/c','functions/inverse/relationship/1');
INSERT INTO tys_questions_to_techniques VALUES('lfy3ykzab3tf7f5ntfktagnm','2012/p1/q7/a','functions/more/self-inverse');
INSERT INTO tys_questions_to_techniques VALUES('rjwjquagh1w4hqksqbf6sfa8','2013/p2/q1/a','functions/composite/existence');
INSERT INTO tys_questions_to_techniques VALUES('kmo3b2v9as1ksee08u5fbjmk','2013/p2/q1/b','functions/composite/formula');
INSERT INTO tys_questions_to_techniques VALUES('jx6x8ibcjy2y9raqx83u0yfu','2022/p1/q6/b','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('f8j6ae2kteym0giubddxfhlh','2022/p1/q6/c','functions/composite/self-compose');
INSERT INTO tys_questions_to_techniques VALUES('sekgxzm0uq4vqvg5hzovuqe6','2022/p1/q6/c','functions/composite/compose-inverse');
INSERT INTO tys_questions_to_techniques VALUES('tbh2ecmq9xhviv626sgzgnm4','2022/p1/q6/d','functions/more/self-inverse');
INSERT INTO tys_questions_to_techniques VALUES('ei8bu16n3p77d1s0vnfvo57j','2023/p1/q7/b','functions/concepts/domain-and-range/1');
INSERT INTO tys_questions_to_techniques VALUES('foc0vycjydwg8gxwwk51d5hs','2023/p1/q7/c','functions/composite/self-compose');
INSERT INTO tys_questions_to_techniques VALUES('qts0jaclmsrl71595ne1pewm','2023/p1/q7/c','functions/composite/existence');
INSERT INTO tys_questions_to_techniques VALUES('fgqo4frxql2f9iaxjk06jtq6','2023/p1/q7/d','functions/inverse/restriction');
INSERT INTO tys_questions_to_techniques VALUES('lggdoelszp9ycfl1nbmlpkjd','2023/p1/q7/e','functions/inverse/formula');
INSERT INTO tys_questions_to_techniques VALUES('yl6a5bioygbwgob8jj7mp6v8','2023/p1/q7/e','functions/inverse/domain');
COMMIT;
