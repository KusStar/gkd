/**
 * @reference https://stackoverflow.com/questions/45415436/nested-keyof-object-paths-using-dot-notation
 */

type AnyObject = Record<string, any>

type DotJoin<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`

type DeepKeys<O extends AnyObject> = {
  [K in keyof O]: O[K] extends AnyObject ? K : never
}[keyof O]

type DotBranch<O extends AnyObject, P extends string = '', K extends string = keyof O> =
  K extends DeepKeys<O>
  ? DotBranch<O[K], DotJoin<P, K>>
  : DotJoin<P, K>
