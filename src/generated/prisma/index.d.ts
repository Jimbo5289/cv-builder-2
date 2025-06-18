
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CV
 * 
 */
export type CV = $Result.DefaultSelection<Prisma.$CVPayload>
/**
 * Model CVSection
 * 
 */
export type CVSection = $Result.DefaultSelection<Prisma.$CVSectionPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model PageView
 * 
 */
export type PageView = $Result.DefaultSelection<Prisma.$PageViewPayload>
/**
 * Model ErrorLog
 * 
 */
export type ErrorLog = $Result.DefaultSelection<Prisma.$ErrorLogPayload>
/**
 * Model PerformanceMetric
 * 
 */
export type PerformanceMetric = $Result.DefaultSelection<Prisma.$PerformanceMetricPayload>
/**
 * Model MetricsSnapshot
 * 
 */
export type MetricsSnapshot = $Result.DefaultSelection<Prisma.$MetricsSnapshotPayload>
/**
 * Model TemporaryAccess
 * 
 */
export type TemporaryAccess = $Result.DefaultSelection<Prisma.$TemporaryAccessPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CVS
 * const cVS = await prisma.cV.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CVS
   * const cVS = await prisma.cV.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.cV`: Exposes CRUD operations for the **CV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CVS
    * const cVS = await prisma.cV.findMany()
    * ```
    */
  get cV(): Prisma.CVDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cVSection`: Exposes CRUD operations for the **CVSection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CVSections
    * const cVSections = await prisma.cVSection.findMany()
    * ```
    */
  get cVSection(): Prisma.CVSectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pageView`: Exposes CRUD operations for the **PageView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PageViews
    * const pageViews = await prisma.pageView.findMany()
    * ```
    */
  get pageView(): Prisma.PageViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.errorLog`: Exposes CRUD operations for the **ErrorLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ErrorLogs
    * const errorLogs = await prisma.errorLog.findMany()
    * ```
    */
  get errorLog(): Prisma.ErrorLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.performanceMetric`: Exposes CRUD operations for the **PerformanceMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PerformanceMetrics
    * const performanceMetrics = await prisma.performanceMetric.findMany()
    * ```
    */
  get performanceMetric(): Prisma.PerformanceMetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metricsSnapshot`: Exposes CRUD operations for the **MetricsSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MetricsSnapshots
    * const metricsSnapshots = await prisma.metricsSnapshot.findMany()
    * ```
    */
  get metricsSnapshot(): Prisma.MetricsSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.temporaryAccess`: Exposes CRUD operations for the **TemporaryAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TemporaryAccesses
    * const temporaryAccesses = await prisma.temporaryAccess.findMany()
    * ```
    */
  get temporaryAccess(): Prisma.TemporaryAccessDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CV: 'CV',
    CVSection: 'CVSection',
    Payment: 'Payment',
    Subscription: 'Subscription',
    User: 'User',
    RefreshToken: 'RefreshToken',
    PageView: 'PageView',
    ErrorLog: 'ErrorLog',
    PerformanceMetric: 'PerformanceMetric',
    MetricsSnapshot: 'MetricsSnapshot',
    TemporaryAccess: 'TemporaryAccess'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "cV" | "cVSection" | "payment" | "subscription" | "user" | "refreshToken" | "pageView" | "errorLog" | "performanceMetric" | "metricsSnapshot" | "temporaryAccess"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CV: {
        payload: Prisma.$CVPayload<ExtArgs>
        fields: Prisma.CVFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CVFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CVFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          findFirst: {
            args: Prisma.CVFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CVFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          findMany: {
            args: Prisma.CVFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>[]
          }
          create: {
            args: Prisma.CVCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          createMany: {
            args: Prisma.CVCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CVCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>[]
          }
          delete: {
            args: Prisma.CVDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          update: {
            args: Prisma.CVUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          deleteMany: {
            args: Prisma.CVDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CVUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CVUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>[]
          }
          upsert: {
            args: Prisma.CVUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          aggregate: {
            args: Prisma.CVAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCV>
          }
          groupBy: {
            args: Prisma.CVGroupByArgs<ExtArgs>
            result: $Utils.Optional<CVGroupByOutputType>[]
          }
          count: {
            args: Prisma.CVCountArgs<ExtArgs>
            result: $Utils.Optional<CVCountAggregateOutputType> | number
          }
        }
      }
      CVSection: {
        payload: Prisma.$CVSectionPayload<ExtArgs>
        fields: Prisma.CVSectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CVSectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CVSectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          findFirst: {
            args: Prisma.CVSectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CVSectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          findMany: {
            args: Prisma.CVSectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>[]
          }
          create: {
            args: Prisma.CVSectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          createMany: {
            args: Prisma.CVSectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CVSectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>[]
          }
          delete: {
            args: Prisma.CVSectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          update: {
            args: Prisma.CVSectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          deleteMany: {
            args: Prisma.CVSectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CVSectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CVSectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>[]
          }
          upsert: {
            args: Prisma.CVSectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVSectionPayload>
          }
          aggregate: {
            args: Prisma.CVSectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCVSection>
          }
          groupBy: {
            args: Prisma.CVSectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CVSectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CVSectionCountArgs<ExtArgs>
            result: $Utils.Optional<CVSectionCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      PageView: {
        payload: Prisma.$PageViewPayload<ExtArgs>
        fields: Prisma.PageViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PageViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PageViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          findFirst: {
            args: Prisma.PageViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PageViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          findMany: {
            args: Prisma.PageViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          create: {
            args: Prisma.PageViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          createMany: {
            args: Prisma.PageViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PageViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          delete: {
            args: Prisma.PageViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          update: {
            args: Prisma.PageViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          deleteMany: {
            args: Prisma.PageViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PageViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PageViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          upsert: {
            args: Prisma.PageViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          aggregate: {
            args: Prisma.PageViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePageView>
          }
          groupBy: {
            args: Prisma.PageViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<PageViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.PageViewCountArgs<ExtArgs>
            result: $Utils.Optional<PageViewCountAggregateOutputType> | number
          }
        }
      }
      ErrorLog: {
        payload: Prisma.$ErrorLogPayload<ExtArgs>
        fields: Prisma.ErrorLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ErrorLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ErrorLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          findFirst: {
            args: Prisma.ErrorLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ErrorLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          findMany: {
            args: Prisma.ErrorLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>[]
          }
          create: {
            args: Prisma.ErrorLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          createMany: {
            args: Prisma.ErrorLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ErrorLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>[]
          }
          delete: {
            args: Prisma.ErrorLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          update: {
            args: Prisma.ErrorLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          deleteMany: {
            args: Prisma.ErrorLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ErrorLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ErrorLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>[]
          }
          upsert: {
            args: Prisma.ErrorLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorLogPayload>
          }
          aggregate: {
            args: Prisma.ErrorLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateErrorLog>
          }
          groupBy: {
            args: Prisma.ErrorLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ErrorLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ErrorLogCountArgs<ExtArgs>
            result: $Utils.Optional<ErrorLogCountAggregateOutputType> | number
          }
        }
      }
      PerformanceMetric: {
        payload: Prisma.$PerformanceMetricPayload<ExtArgs>
        fields: Prisma.PerformanceMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PerformanceMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PerformanceMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          findFirst: {
            args: Prisma.PerformanceMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PerformanceMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          findMany: {
            args: Prisma.PerformanceMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[]
          }
          create: {
            args: Prisma.PerformanceMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          createMany: {
            args: Prisma.PerformanceMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PerformanceMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[]
          }
          delete: {
            args: Prisma.PerformanceMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          update: {
            args: Prisma.PerformanceMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          deleteMany: {
            args: Prisma.PerformanceMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PerformanceMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PerformanceMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[]
          }
          upsert: {
            args: Prisma.PerformanceMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>
          }
          aggregate: {
            args: Prisma.PerformanceMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePerformanceMetric>
          }
          groupBy: {
            args: Prisma.PerformanceMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerformanceMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.PerformanceMetricCountArgs<ExtArgs>
            result: $Utils.Optional<PerformanceMetricCountAggregateOutputType> | number
          }
        }
      }
      MetricsSnapshot: {
        payload: Prisma.$MetricsSnapshotPayload<ExtArgs>
        fields: Prisma.MetricsSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetricsSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetricsSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          findFirst: {
            args: Prisma.MetricsSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetricsSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          findMany: {
            args: Prisma.MetricsSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>[]
          }
          create: {
            args: Prisma.MetricsSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          createMany: {
            args: Prisma.MetricsSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetricsSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>[]
          }
          delete: {
            args: Prisma.MetricsSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          update: {
            args: Prisma.MetricsSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.MetricsSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetricsSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetricsSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.MetricsSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricsSnapshotPayload>
          }
          aggregate: {
            args: Prisma.MetricsSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetricsSnapshot>
          }
          groupBy: {
            args: Prisma.MetricsSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetricsSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetricsSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<MetricsSnapshotCountAggregateOutputType> | number
          }
        }
      }
      TemporaryAccess: {
        payload: Prisma.$TemporaryAccessPayload<ExtArgs>
        fields: Prisma.TemporaryAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemporaryAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemporaryAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          findFirst: {
            args: Prisma.TemporaryAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemporaryAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          findMany: {
            args: Prisma.TemporaryAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>[]
          }
          create: {
            args: Prisma.TemporaryAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          createMany: {
            args: Prisma.TemporaryAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemporaryAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>[]
          }
          delete: {
            args: Prisma.TemporaryAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          update: {
            args: Prisma.TemporaryAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          deleteMany: {
            args: Prisma.TemporaryAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemporaryAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TemporaryAccessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>[]
          }
          upsert: {
            args: Prisma.TemporaryAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemporaryAccessPayload>
          }
          aggregate: {
            args: Prisma.TemporaryAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemporaryAccess>
          }
          groupBy: {
            args: Prisma.TemporaryAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemporaryAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemporaryAccessCountArgs<ExtArgs>
            result: $Utils.Optional<TemporaryAccessCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    cV?: CVOmit
    cVSection?: CVSectionOmit
    payment?: PaymentOmit
    subscription?: SubscriptionOmit
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    pageView?: PageViewOmit
    errorLog?: ErrorLogOmit
    performanceMetric?: PerformanceMetricOmit
    metricsSnapshot?: MetricsSnapshotOmit
    temporaryAccess?: TemporaryAccessOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CVCountOutputType
   */

  export type CVCountOutputType = {
    CVSection: number
  }

  export type CVCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CVSection?: boolean | CVCountOutputTypeCountCVSectionArgs
  }

  // Custom InputTypes
  /**
   * CVCountOutputType without action
   */
  export type CVCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVCountOutputType
     */
    select?: CVCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CVCountOutputType without action
   */
  export type CVCountOutputTypeCountCVSectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVSectionWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    CV: number
    Payment: number
    Subscription: number
    RefreshTokens: number
    PageViews: number
    ErrorLogs: number
    temporaryAccess: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CV?: boolean | UserCountOutputTypeCountCVArgs
    Payment?: boolean | UserCountOutputTypeCountPaymentArgs
    Subscription?: boolean | UserCountOutputTypeCountSubscriptionArgs
    RefreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
    PageViews?: boolean | UserCountOutputTypeCountPageViewsArgs
    ErrorLogs?: boolean | UserCountOutputTypeCountErrorLogsArgs
    temporaryAccess?: boolean | UserCountOutputTypeCountTemporaryAccessArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCVArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPageViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageViewWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountErrorLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ErrorLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTemporaryAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemporaryAccessWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CV
   */

  export type AggregateCV = {
    _count: CVCountAggregateOutputType | null
    _avg: CVAvgAggregateOutputType | null
    _sum: CVSumAggregateOutputType | null
    _min: CVMinAggregateOutputType | null
    _max: CVMaxAggregateOutputType | null
  }

  export type CVAvgAggregateOutputType = {
    atsScore: number | null
  }

  export type CVSumAggregateOutputType = {
    atsScore: number | null
  }

  export type CVMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    atsScore: number | null
    isPublic: boolean | null
    publishedAt: Date | null
  }

  export type CVMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    atsScore: number | null
    isPublic: boolean | null
    publishedAt: Date | null
  }

  export type CVCountAggregateOutputType = {
    id: number
    title: number
    content: number
    createdAt: number
    updatedAt: number
    userId: number
    atsScore: number
    isPublic: number
    publishedAt: number
    _all: number
  }


  export type CVAvgAggregateInputType = {
    atsScore?: true
  }

  export type CVSumAggregateInputType = {
    atsScore?: true
  }

  export type CVMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    atsScore?: true
    isPublic?: true
    publishedAt?: true
  }

  export type CVMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    atsScore?: true
    isPublic?: true
    publishedAt?: true
  }

  export type CVCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    atsScore?: true
    isPublic?: true
    publishedAt?: true
    _all?: true
  }

  export type CVAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CV to aggregate.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CVS
    **/
    _count?: true | CVCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CVAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CVSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CVMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CVMaxAggregateInputType
  }

  export type GetCVAggregateType<T extends CVAggregateArgs> = {
        [P in keyof T & keyof AggregateCV]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCV[P]>
      : GetScalarType<T[P], AggregateCV[P]>
  }




  export type CVGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVWhereInput
    orderBy?: CVOrderByWithAggregationInput | CVOrderByWithAggregationInput[]
    by: CVScalarFieldEnum[] | CVScalarFieldEnum
    having?: CVScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CVCountAggregateInputType | true
    _avg?: CVAvgAggregateInputType
    _sum?: CVSumAggregateInputType
    _min?: CVMinAggregateInputType
    _max?: CVMaxAggregateInputType
  }

  export type CVGroupByOutputType = {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    userId: string
    atsScore: number | null
    isPublic: boolean
    publishedAt: Date | null
    _count: CVCountAggregateOutputType | null
    _avg: CVAvgAggregateOutputType | null
    _sum: CVSumAggregateOutputType | null
    _min: CVMinAggregateOutputType | null
    _max: CVMaxAggregateOutputType | null
  }

  type GetCVGroupByPayload<T extends CVGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CVGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CVGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CVGroupByOutputType[P]>
            : GetScalarType<T[P], CVGroupByOutputType[P]>
        }
      >
    >


  export type CVSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    atsScore?: boolean
    isPublic?: boolean
    publishedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
    CVSection?: boolean | CV$CVSectionArgs<ExtArgs>
    _count?: boolean | CVCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cV"]>

  export type CVSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    atsScore?: boolean
    isPublic?: boolean
    publishedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cV"]>

  export type CVSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    atsScore?: boolean
    isPublic?: boolean
    publishedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cV"]>

  export type CVSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    atsScore?: boolean
    isPublic?: boolean
    publishedAt?: boolean
  }

  export type CVOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "createdAt" | "updatedAt" | "userId" | "atsScore" | "isPublic" | "publishedAt", ExtArgs["result"]["cV"]>
  export type CVInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
    CVSection?: boolean | CV$CVSectionArgs<ExtArgs>
    _count?: boolean | CVCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CVIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CVIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CVPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CV"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
      CVSection: Prisma.$CVSectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      createdAt: Date
      updatedAt: Date
      userId: string
      atsScore: number | null
      isPublic: boolean
      publishedAt: Date | null
    }, ExtArgs["result"]["cV"]>
    composites: {}
  }

  type CVGetPayload<S extends boolean | null | undefined | CVDefaultArgs> = $Result.GetResult<Prisma.$CVPayload, S>

  type CVCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CVFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CVCountAggregateInputType | true
    }

  export interface CVDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CV'], meta: { name: 'CV' } }
    /**
     * Find zero or one CV that matches the filter.
     * @param {CVFindUniqueArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CVFindUniqueArgs>(args: SelectSubset<T, CVFindUniqueArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CV that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CVFindUniqueOrThrowArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CVFindUniqueOrThrowArgs>(args: SelectSubset<T, CVFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CV that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindFirstArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CVFindFirstArgs>(args?: SelectSubset<T, CVFindFirstArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CV that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindFirstOrThrowArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CVFindFirstOrThrowArgs>(args?: SelectSubset<T, CVFindFirstOrThrowArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CVS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CVS
     * const cVS = await prisma.cV.findMany()
     * 
     * // Get first 10 CVS
     * const cVS = await prisma.cV.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cVWithIdOnly = await prisma.cV.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CVFindManyArgs>(args?: SelectSubset<T, CVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CV.
     * @param {CVCreateArgs} args - Arguments to create a CV.
     * @example
     * // Create one CV
     * const CV = await prisma.cV.create({
     *   data: {
     *     // ... data to create a CV
     *   }
     * })
     * 
     */
    create<T extends CVCreateArgs>(args: SelectSubset<T, CVCreateArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CVS.
     * @param {CVCreateManyArgs} args - Arguments to create many CVS.
     * @example
     * // Create many CVS
     * const cV = await prisma.cV.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CVCreateManyArgs>(args?: SelectSubset<T, CVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CVS and returns the data saved in the database.
     * @param {CVCreateManyAndReturnArgs} args - Arguments to create many CVS.
     * @example
     * // Create many CVS
     * const cV = await prisma.cV.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CVS and only return the `id`
     * const cVWithIdOnly = await prisma.cV.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CVCreateManyAndReturnArgs>(args?: SelectSubset<T, CVCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CV.
     * @param {CVDeleteArgs} args - Arguments to delete one CV.
     * @example
     * // Delete one CV
     * const CV = await prisma.cV.delete({
     *   where: {
     *     // ... filter to delete one CV
     *   }
     * })
     * 
     */
    delete<T extends CVDeleteArgs>(args: SelectSubset<T, CVDeleteArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CV.
     * @param {CVUpdateArgs} args - Arguments to update one CV.
     * @example
     * // Update one CV
     * const cV = await prisma.cV.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CVUpdateArgs>(args: SelectSubset<T, CVUpdateArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CVS.
     * @param {CVDeleteManyArgs} args - Arguments to filter CVS to delete.
     * @example
     * // Delete a few CVS
     * const { count } = await prisma.cV.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CVDeleteManyArgs>(args?: SelectSubset<T, CVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CVS
     * const cV = await prisma.cV.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CVUpdateManyArgs>(args: SelectSubset<T, CVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CVS and returns the data updated in the database.
     * @param {CVUpdateManyAndReturnArgs} args - Arguments to update many CVS.
     * @example
     * // Update many CVS
     * const cV = await prisma.cV.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CVS and only return the `id`
     * const cVWithIdOnly = await prisma.cV.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CVUpdateManyAndReturnArgs>(args: SelectSubset<T, CVUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CV.
     * @param {CVUpsertArgs} args - Arguments to update or create a CV.
     * @example
     * // Update or create a CV
     * const cV = await prisma.cV.upsert({
     *   create: {
     *     // ... data to create a CV
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CV we want to update
     *   }
     * })
     */
    upsert<T extends CVUpsertArgs>(args: SelectSubset<T, CVUpsertArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVCountArgs} args - Arguments to filter CVS to count.
     * @example
     * // Count the number of CVS
     * const count = await prisma.cV.count({
     *   where: {
     *     // ... the filter for the CVS we want to count
     *   }
     * })
    **/
    count<T extends CVCountArgs>(
      args?: Subset<T, CVCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CVCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CVAggregateArgs>(args: Subset<T, CVAggregateArgs>): Prisma.PrismaPromise<GetCVAggregateType<T>>

    /**
     * Group by CV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CVGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CVGroupByArgs['orderBy'] }
        : { orderBy?: CVGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CV model
   */
  readonly fields: CVFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CV.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CVClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    CVSection<T extends CV$CVSectionArgs<ExtArgs> = {}>(args?: Subset<T, CV$CVSectionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CV model
   */
  interface CVFieldRefs {
    readonly id: FieldRef<"CV", 'String'>
    readonly title: FieldRef<"CV", 'String'>
    readonly content: FieldRef<"CV", 'String'>
    readonly createdAt: FieldRef<"CV", 'DateTime'>
    readonly updatedAt: FieldRef<"CV", 'DateTime'>
    readonly userId: FieldRef<"CV", 'String'>
    readonly atsScore: FieldRef<"CV", 'Int'>
    readonly isPublic: FieldRef<"CV", 'Boolean'>
    readonly publishedAt: FieldRef<"CV", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CV findUnique
   */
  export type CVFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV findUniqueOrThrow
   */
  export type CVFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV findFirst
   */
  export type CVFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVS.
     */
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV findFirstOrThrow
   */
  export type CVFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVS.
     */
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV findMany
   */
  export type CVFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CVS to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV create
   */
  export type CVCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The data needed to create a CV.
     */
    data: XOR<CVCreateInput, CVUncheckedCreateInput>
  }

  /**
   * CV createMany
   */
  export type CVCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CVS.
     */
    data: CVCreateManyInput | CVCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CV createManyAndReturn
   */
  export type CVCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * The data used to create many CVS.
     */
    data: CVCreateManyInput | CVCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CV update
   */
  export type CVUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The data needed to update a CV.
     */
    data: XOR<CVUpdateInput, CVUncheckedUpdateInput>
    /**
     * Choose, which CV to update.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV updateMany
   */
  export type CVUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CVS.
     */
    data: XOR<CVUpdateManyMutationInput, CVUncheckedUpdateManyInput>
    /**
     * Filter which CVS to update
     */
    where?: CVWhereInput
    /**
     * Limit how many CVS to update.
     */
    limit?: number
  }

  /**
   * CV updateManyAndReturn
   */
  export type CVUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * The data used to update CVS.
     */
    data: XOR<CVUpdateManyMutationInput, CVUncheckedUpdateManyInput>
    /**
     * Filter which CVS to update
     */
    where?: CVWhereInput
    /**
     * Limit how many CVS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CV upsert
   */
  export type CVUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The filter to search for the CV to update in case it exists.
     */
    where: CVWhereUniqueInput
    /**
     * In case the CV found by the `where` argument doesn't exist, create a new CV with this data.
     */
    create: XOR<CVCreateInput, CVUncheckedCreateInput>
    /**
     * In case the CV was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CVUpdateInput, CVUncheckedUpdateInput>
  }

  /**
   * CV delete
   */
  export type CVDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter which CV to delete.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV deleteMany
   */
  export type CVDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CVS to delete
     */
    where?: CVWhereInput
    /**
     * Limit how many CVS to delete.
     */
    limit?: number
  }

  /**
   * CV.CVSection
   */
  export type CV$CVSectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    where?: CVSectionWhereInput
    orderBy?: CVSectionOrderByWithRelationInput | CVSectionOrderByWithRelationInput[]
    cursor?: CVSectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CVSectionScalarFieldEnum | CVSectionScalarFieldEnum[]
  }

  /**
   * CV without action
   */
  export type CVDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
  }


  /**
   * Model CVSection
   */

  export type AggregateCVSection = {
    _count: CVSectionCountAggregateOutputType | null
    _avg: CVSectionAvgAggregateOutputType | null
    _sum: CVSectionSumAggregateOutputType | null
    _min: CVSectionMinAggregateOutputType | null
    _max: CVSectionMaxAggregateOutputType | null
  }

  export type CVSectionAvgAggregateOutputType = {
    order: number | null
  }

  export type CVSectionSumAggregateOutputType = {
    order: number | null
  }

  export type CVSectionMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    order: number | null
    cvId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CVSectionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    order: number | null
    cvId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CVSectionCountAggregateOutputType = {
    id: number
    title: number
    content: number
    order: number
    cvId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CVSectionAvgAggregateInputType = {
    order?: true
  }

  export type CVSectionSumAggregateInputType = {
    order?: true
  }

  export type CVSectionMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    order?: true
    cvId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CVSectionMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    order?: true
    cvId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CVSectionCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    order?: true
    cvId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CVSectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CVSection to aggregate.
     */
    where?: CVSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVSections to fetch.
     */
    orderBy?: CVSectionOrderByWithRelationInput | CVSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CVSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CVSections
    **/
    _count?: true | CVSectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CVSectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CVSectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CVSectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CVSectionMaxAggregateInputType
  }

  export type GetCVSectionAggregateType<T extends CVSectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCVSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCVSection[P]>
      : GetScalarType<T[P], AggregateCVSection[P]>
  }




  export type CVSectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVSectionWhereInput
    orderBy?: CVSectionOrderByWithAggregationInput | CVSectionOrderByWithAggregationInput[]
    by: CVSectionScalarFieldEnum[] | CVSectionScalarFieldEnum
    having?: CVSectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CVSectionCountAggregateInputType | true
    _avg?: CVSectionAvgAggregateInputType
    _sum?: CVSectionSumAggregateInputType
    _min?: CVSectionMinAggregateInputType
    _max?: CVSectionMaxAggregateInputType
  }

  export type CVSectionGroupByOutputType = {
    id: string
    title: string
    content: string
    order: number
    cvId: string
    createdAt: Date
    updatedAt: Date
    _count: CVSectionCountAggregateOutputType | null
    _avg: CVSectionAvgAggregateOutputType | null
    _sum: CVSectionSumAggregateOutputType | null
    _min: CVSectionMinAggregateOutputType | null
    _max: CVSectionMaxAggregateOutputType | null
  }

  type GetCVSectionGroupByPayload<T extends CVSectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CVSectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CVSectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CVSectionGroupByOutputType[P]>
            : GetScalarType<T[P], CVSectionGroupByOutputType[P]>
        }
      >
    >


  export type CVSectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    cvId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cVSection"]>

  export type CVSectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    cvId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cVSection"]>

  export type CVSectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    cvId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cVSection"]>

  export type CVSectionSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    cvId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CVSectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "order" | "cvId" | "createdAt" | "updatedAt", ExtArgs["result"]["cVSection"]>
  export type CVSectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }
  export type CVSectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }
  export type CVSectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CV?: boolean | CVDefaultArgs<ExtArgs>
  }

  export type $CVSectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CVSection"
    objects: {
      CV: Prisma.$CVPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      order: number
      cvId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cVSection"]>
    composites: {}
  }

  type CVSectionGetPayload<S extends boolean | null | undefined | CVSectionDefaultArgs> = $Result.GetResult<Prisma.$CVSectionPayload, S>

  type CVSectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CVSectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CVSectionCountAggregateInputType | true
    }

  export interface CVSectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CVSection'], meta: { name: 'CVSection' } }
    /**
     * Find zero or one CVSection that matches the filter.
     * @param {CVSectionFindUniqueArgs} args - Arguments to find a CVSection
     * @example
     * // Get one CVSection
     * const cVSection = await prisma.cVSection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CVSectionFindUniqueArgs>(args: SelectSubset<T, CVSectionFindUniqueArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CVSection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CVSectionFindUniqueOrThrowArgs} args - Arguments to find a CVSection
     * @example
     * // Get one CVSection
     * const cVSection = await prisma.cVSection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CVSectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CVSectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CVSection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionFindFirstArgs} args - Arguments to find a CVSection
     * @example
     * // Get one CVSection
     * const cVSection = await prisma.cVSection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CVSectionFindFirstArgs>(args?: SelectSubset<T, CVSectionFindFirstArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CVSection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionFindFirstOrThrowArgs} args - Arguments to find a CVSection
     * @example
     * // Get one CVSection
     * const cVSection = await prisma.cVSection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CVSectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CVSectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CVSections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CVSections
     * const cVSections = await prisma.cVSection.findMany()
     * 
     * // Get first 10 CVSections
     * const cVSections = await prisma.cVSection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cVSectionWithIdOnly = await prisma.cVSection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CVSectionFindManyArgs>(args?: SelectSubset<T, CVSectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CVSection.
     * @param {CVSectionCreateArgs} args - Arguments to create a CVSection.
     * @example
     * // Create one CVSection
     * const CVSection = await prisma.cVSection.create({
     *   data: {
     *     // ... data to create a CVSection
     *   }
     * })
     * 
     */
    create<T extends CVSectionCreateArgs>(args: SelectSubset<T, CVSectionCreateArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CVSections.
     * @param {CVSectionCreateManyArgs} args - Arguments to create many CVSections.
     * @example
     * // Create many CVSections
     * const cVSection = await prisma.cVSection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CVSectionCreateManyArgs>(args?: SelectSubset<T, CVSectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CVSections and returns the data saved in the database.
     * @param {CVSectionCreateManyAndReturnArgs} args - Arguments to create many CVSections.
     * @example
     * // Create many CVSections
     * const cVSection = await prisma.cVSection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CVSections and only return the `id`
     * const cVSectionWithIdOnly = await prisma.cVSection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CVSectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CVSectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CVSection.
     * @param {CVSectionDeleteArgs} args - Arguments to delete one CVSection.
     * @example
     * // Delete one CVSection
     * const CVSection = await prisma.cVSection.delete({
     *   where: {
     *     // ... filter to delete one CVSection
     *   }
     * })
     * 
     */
    delete<T extends CVSectionDeleteArgs>(args: SelectSubset<T, CVSectionDeleteArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CVSection.
     * @param {CVSectionUpdateArgs} args - Arguments to update one CVSection.
     * @example
     * // Update one CVSection
     * const cVSection = await prisma.cVSection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CVSectionUpdateArgs>(args: SelectSubset<T, CVSectionUpdateArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CVSections.
     * @param {CVSectionDeleteManyArgs} args - Arguments to filter CVSections to delete.
     * @example
     * // Delete a few CVSections
     * const { count } = await prisma.cVSection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CVSectionDeleteManyArgs>(args?: SelectSubset<T, CVSectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CVSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CVSections
     * const cVSection = await prisma.cVSection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CVSectionUpdateManyArgs>(args: SelectSubset<T, CVSectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CVSections and returns the data updated in the database.
     * @param {CVSectionUpdateManyAndReturnArgs} args - Arguments to update many CVSections.
     * @example
     * // Update many CVSections
     * const cVSection = await prisma.cVSection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CVSections and only return the `id`
     * const cVSectionWithIdOnly = await prisma.cVSection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CVSectionUpdateManyAndReturnArgs>(args: SelectSubset<T, CVSectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CVSection.
     * @param {CVSectionUpsertArgs} args - Arguments to update or create a CVSection.
     * @example
     * // Update or create a CVSection
     * const cVSection = await prisma.cVSection.upsert({
     *   create: {
     *     // ... data to create a CVSection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CVSection we want to update
     *   }
     * })
     */
    upsert<T extends CVSectionUpsertArgs>(args: SelectSubset<T, CVSectionUpsertArgs<ExtArgs>>): Prisma__CVSectionClient<$Result.GetResult<Prisma.$CVSectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CVSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionCountArgs} args - Arguments to filter CVSections to count.
     * @example
     * // Count the number of CVSections
     * const count = await prisma.cVSection.count({
     *   where: {
     *     // ... the filter for the CVSections we want to count
     *   }
     * })
    **/
    count<T extends CVSectionCountArgs>(
      args?: Subset<T, CVSectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CVSectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CVSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CVSectionAggregateArgs>(args: Subset<T, CVSectionAggregateArgs>): Prisma.PrismaPromise<GetCVSectionAggregateType<T>>

    /**
     * Group by CVSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVSectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CVSectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CVSectionGroupByArgs['orderBy'] }
        : { orderBy?: CVSectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CVSectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCVSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CVSection model
   */
  readonly fields: CVSectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CVSection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CVSectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    CV<T extends CVDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CVDefaultArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CVSection model
   */
  interface CVSectionFieldRefs {
    readonly id: FieldRef<"CVSection", 'String'>
    readonly title: FieldRef<"CVSection", 'String'>
    readonly content: FieldRef<"CVSection", 'String'>
    readonly order: FieldRef<"CVSection", 'Int'>
    readonly cvId: FieldRef<"CVSection", 'String'>
    readonly createdAt: FieldRef<"CVSection", 'DateTime'>
    readonly updatedAt: FieldRef<"CVSection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CVSection findUnique
   */
  export type CVSectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter, which CVSection to fetch.
     */
    where: CVSectionWhereUniqueInput
  }

  /**
   * CVSection findUniqueOrThrow
   */
  export type CVSectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter, which CVSection to fetch.
     */
    where: CVSectionWhereUniqueInput
  }

  /**
   * CVSection findFirst
   */
  export type CVSectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter, which CVSection to fetch.
     */
    where?: CVSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVSections to fetch.
     */
    orderBy?: CVSectionOrderByWithRelationInput | CVSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVSections.
     */
    cursor?: CVSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVSections.
     */
    distinct?: CVSectionScalarFieldEnum | CVSectionScalarFieldEnum[]
  }

  /**
   * CVSection findFirstOrThrow
   */
  export type CVSectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter, which CVSection to fetch.
     */
    where?: CVSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVSections to fetch.
     */
    orderBy?: CVSectionOrderByWithRelationInput | CVSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVSections.
     */
    cursor?: CVSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVSections.
     */
    distinct?: CVSectionScalarFieldEnum | CVSectionScalarFieldEnum[]
  }

  /**
   * CVSection findMany
   */
  export type CVSectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter, which CVSections to fetch.
     */
    where?: CVSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVSections to fetch.
     */
    orderBy?: CVSectionOrderByWithRelationInput | CVSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CVSections.
     */
    cursor?: CVSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVSections.
     */
    skip?: number
    distinct?: CVSectionScalarFieldEnum | CVSectionScalarFieldEnum[]
  }

  /**
   * CVSection create
   */
  export type CVSectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * The data needed to create a CVSection.
     */
    data: XOR<CVSectionCreateInput, CVSectionUncheckedCreateInput>
  }

  /**
   * CVSection createMany
   */
  export type CVSectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CVSections.
     */
    data: CVSectionCreateManyInput | CVSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CVSection createManyAndReturn
   */
  export type CVSectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * The data used to create many CVSections.
     */
    data: CVSectionCreateManyInput | CVSectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CVSection update
   */
  export type CVSectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * The data needed to update a CVSection.
     */
    data: XOR<CVSectionUpdateInput, CVSectionUncheckedUpdateInput>
    /**
     * Choose, which CVSection to update.
     */
    where: CVSectionWhereUniqueInput
  }

  /**
   * CVSection updateMany
   */
  export type CVSectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CVSections.
     */
    data: XOR<CVSectionUpdateManyMutationInput, CVSectionUncheckedUpdateManyInput>
    /**
     * Filter which CVSections to update
     */
    where?: CVSectionWhereInput
    /**
     * Limit how many CVSections to update.
     */
    limit?: number
  }

  /**
   * CVSection updateManyAndReturn
   */
  export type CVSectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * The data used to update CVSections.
     */
    data: XOR<CVSectionUpdateManyMutationInput, CVSectionUncheckedUpdateManyInput>
    /**
     * Filter which CVSections to update
     */
    where?: CVSectionWhereInput
    /**
     * Limit how many CVSections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CVSection upsert
   */
  export type CVSectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * The filter to search for the CVSection to update in case it exists.
     */
    where: CVSectionWhereUniqueInput
    /**
     * In case the CVSection found by the `where` argument doesn't exist, create a new CVSection with this data.
     */
    create: XOR<CVSectionCreateInput, CVSectionUncheckedCreateInput>
    /**
     * In case the CVSection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CVSectionUpdateInput, CVSectionUncheckedUpdateInput>
  }

  /**
   * CVSection delete
   */
  export type CVSectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
    /**
     * Filter which CVSection to delete.
     */
    where: CVSectionWhereUniqueInput
  }

  /**
   * CVSection deleteMany
   */
  export type CVSectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CVSections to delete
     */
    where?: CVSectionWhereInput
    /**
     * Limit how many CVSections to delete.
     */
    limit?: number
  }

  /**
   * CVSection without action
   */
  export type CVSectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVSection
     */
    select?: CVSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CVSection
     */
    omit?: CVSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVSectionInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    createdAt: Date | null
    stripePaymentId: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    createdAt: Date | null
    stripePaymentId: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    userId: number
    amount: number
    currency: number
    status: number
    createdAt: number
    stripePaymentId: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    createdAt?: true
    stripePaymentId?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    createdAt?: true
    stripePaymentId?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    createdAt?: true
    stripePaymentId?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    userId: string
    amount: number
    currency: string
    status: string
    createdAt: Date
    stripePaymentId: string
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    createdAt?: boolean
    stripePaymentId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    createdAt?: boolean
    stripePaymentId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    createdAt?: boolean
    stripePaymentId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    createdAt?: boolean
    stripePaymentId?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "amount" | "currency" | "status" | "createdAt" | "stripePaymentId", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      amount: number
      currency: string
      status: string
      createdAt: Date
      stripePaymentId: string
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly userId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Float'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'String'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly stripePaymentId: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    canceledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    stripeCustomerId: string | null
    stripePriceId: string | null
    stripeSubscriptionId: string | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    canceledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    stripeCustomerId: string | null
    stripePriceId: string | null
    stripeSubscriptionId: string | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    currentPeriodStart: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    canceledAt: number
    createdAt: number
    updatedAt: number
    stripeCustomerId: number
    stripePriceId: number
    stripeSubscriptionId: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
    stripePriceId?: true
    stripeSubscriptionId?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
    stripePriceId?: true
    stripeSubscriptionId?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
    stripePriceId?: true
    stripeSubscriptionId?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    canceledAt: Date | null
    createdAt: Date
    updatedAt: Date
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    stripePriceId?: boolean
    stripeSubscriptionId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    stripePriceId?: boolean
    stripeSubscriptionId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    stripePriceId?: boolean
    stripeSubscriptionId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    stripePriceId?: boolean
    stripeSubscriptionId?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "status" | "currentPeriodStart" | "currentPeriodEnd" | "cancelAtPeriodEnd" | "canceledAt" | "createdAt" | "updatedAt" | "stripeCustomerId" | "stripePriceId" | "stripeSubscriptionId", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: string
      currentPeriodStart: Date
      currentPeriodEnd: Date
      cancelAtPeriodEnd: boolean
      canceledAt: Date | null
      createdAt: Date
      updatedAt: Date
      stripeCustomerId: string
      stripePriceId: string
      stripeSubscriptionId: string
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly currentPeriodStart: FieldRef<"Subscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"Subscription", 'Boolean'>
    readonly canceledAt: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripePriceId: FieldRef<"Subscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"Subscription", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    customerId: string | null
    twoFactorSecret: string | null
    twoFactorEnabled: boolean | null
    marketingConsent: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    failedLoginAttempts: number | null
    lastLogin: Date | null
    lockedUntil: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    customerId: string | null
    twoFactorSecret: string | null
    twoFactorEnabled: boolean | null
    marketingConsent: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    failedLoginAttempts: number | null
    lastLogin: Date | null
    lockedUntil: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    customerId: number
    twoFactorSecret: number
    twoFactorEnabled: number
    backupCodes: number
    marketingConsent: number
    createdAt: number
    updatedAt: number
    failedLoginAttempts: number
    lastLogin: number
    lockedUntil: number
    resetToken: number
    resetTokenExpiry: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserSumAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    customerId?: true
    twoFactorSecret?: true
    twoFactorEnabled?: true
    marketingConsent?: true
    createdAt?: true
    updatedAt?: true
    failedLoginAttempts?: true
    lastLogin?: true
    lockedUntil?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    customerId?: true
    twoFactorSecret?: true
    twoFactorEnabled?: true
    marketingConsent?: true
    createdAt?: true
    updatedAt?: true
    failedLoginAttempts?: true
    lastLogin?: true
    lockedUntil?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    customerId?: true
    twoFactorSecret?: true
    twoFactorEnabled?: true
    backupCodes?: true
    marketingConsent?: true
    createdAt?: true
    updatedAt?: true
    failedLoginAttempts?: true
    lastLogin?: true
    lockedUntil?: true
    resetToken?: true
    resetTokenExpiry?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string
    customerId: string | null
    twoFactorSecret: string | null
    twoFactorEnabled: boolean
    backupCodes: string[]
    marketingConsent: boolean
    createdAt: Date
    updatedAt: Date
    failedLoginAttempts: number
    lastLogin: Date | null
    lockedUntil: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    customerId?: boolean
    twoFactorSecret?: boolean
    twoFactorEnabled?: boolean
    backupCodes?: boolean
    marketingConsent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    failedLoginAttempts?: boolean
    lastLogin?: boolean
    lockedUntil?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
    CV?: boolean | User$CVArgs<ExtArgs>
    Payment?: boolean | User$PaymentArgs<ExtArgs>
    Subscription?: boolean | User$SubscriptionArgs<ExtArgs>
    RefreshTokens?: boolean | User$RefreshTokensArgs<ExtArgs>
    PageViews?: boolean | User$PageViewsArgs<ExtArgs>
    ErrorLogs?: boolean | User$ErrorLogsArgs<ExtArgs>
    temporaryAccess?: boolean | User$temporaryAccessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    customerId?: boolean
    twoFactorSecret?: boolean
    twoFactorEnabled?: boolean
    backupCodes?: boolean
    marketingConsent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    failedLoginAttempts?: boolean
    lastLogin?: boolean
    lockedUntil?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    customerId?: boolean
    twoFactorSecret?: boolean
    twoFactorEnabled?: boolean
    backupCodes?: boolean
    marketingConsent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    failedLoginAttempts?: boolean
    lastLogin?: boolean
    lockedUntil?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    customerId?: boolean
    twoFactorSecret?: boolean
    twoFactorEnabled?: boolean
    backupCodes?: boolean
    marketingConsent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    failedLoginAttempts?: boolean
    lastLogin?: boolean
    lockedUntil?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "customerId" | "twoFactorSecret" | "twoFactorEnabled" | "backupCodes" | "marketingConsent" | "createdAt" | "updatedAt" | "failedLoginAttempts" | "lastLogin" | "lockedUntil" | "resetToken" | "resetTokenExpiry", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CV?: boolean | User$CVArgs<ExtArgs>
    Payment?: boolean | User$PaymentArgs<ExtArgs>
    Subscription?: boolean | User$SubscriptionArgs<ExtArgs>
    RefreshTokens?: boolean | User$RefreshTokensArgs<ExtArgs>
    PageViews?: boolean | User$PageViewsArgs<ExtArgs>
    ErrorLogs?: boolean | User$ErrorLogsArgs<ExtArgs>
    temporaryAccess?: boolean | User$temporaryAccessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      CV: Prisma.$CVPayload<ExtArgs>[]
      Payment: Prisma.$PaymentPayload<ExtArgs>[]
      Subscription: Prisma.$SubscriptionPayload<ExtArgs>[]
      RefreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
      PageViews: Prisma.$PageViewPayload<ExtArgs>[]
      ErrorLogs: Prisma.$ErrorLogPayload<ExtArgs>[]
      temporaryAccess: Prisma.$TemporaryAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      customerId: string | null
      twoFactorSecret: string | null
      twoFactorEnabled: boolean
      backupCodes: string[]
      marketingConsent: boolean
      createdAt: Date
      updatedAt: Date
      failedLoginAttempts: number
      lastLogin: Date | null
      lockedUntil: Date | null
      resetToken: string | null
      resetTokenExpiry: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    CV<T extends User$CVArgs<ExtArgs> = {}>(args?: Subset<T, User$CVArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Payment<T extends User$PaymentArgs<ExtArgs> = {}>(args?: Subset<T, User$PaymentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Subscription<T extends User$SubscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$SubscriptionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    RefreshTokens<T extends User$RefreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$RefreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    PageViews<T extends User$PageViewsArgs<ExtArgs> = {}>(args?: Subset<T, User$PageViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ErrorLogs<T extends User$ErrorLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$ErrorLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    temporaryAccess<T extends User$temporaryAccessArgs<ExtArgs> = {}>(args?: Subset<T, User$temporaryAccessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly customerId: FieldRef<"User", 'String'>
    readonly twoFactorSecret: FieldRef<"User", 'String'>
    readonly twoFactorEnabled: FieldRef<"User", 'Boolean'>
    readonly backupCodes: FieldRef<"User", 'String[]'>
    readonly marketingConsent: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly lockedUntil: FieldRef<"User", 'DateTime'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpiry: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.CV
   */
  export type User$CVArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CV
     */
    omit?: CVOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    where?: CVWhereInput
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    cursor?: CVWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * User.Payment
   */
  export type User$PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.Subscription
   */
  export type User$SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * User.RefreshTokens
   */
  export type User$RefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User.PageViews
   */
  export type User$PageViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    where?: PageViewWhereInput
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    cursor?: PageViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * User.ErrorLogs
   */
  export type User$ErrorLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    where?: ErrorLogWhereInput
    orderBy?: ErrorLogOrderByWithRelationInput | ErrorLogOrderByWithRelationInput[]
    cursor?: ErrorLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ErrorLogScalarFieldEnum | ErrorLogScalarFieldEnum[]
  }

  /**
   * User.temporaryAccess
   */
  export type User$temporaryAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    where?: TemporaryAccessWhereInput
    orderBy?: TemporaryAccessOrderByWithRelationInput | TemporaryAccessOrderByWithRelationInput[]
    cursor?: TemporaryAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemporaryAccessScalarFieldEnum | TemporaryAccessScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    token: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    token: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    token: number
    userId: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    token: string
    userId: string
    expiresAt: Date
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "userId" | "expiresAt" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      userId: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly token: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model PageView
   */

  export type AggregatePageView = {
    _count: PageViewCountAggregateOutputType | null
    _min: PageViewMinAggregateOutputType | null
    _max: PageViewMaxAggregateOutputType | null
  }

  export type PageViewMinAggregateOutputType = {
    id: string | null
    url: string | null
    userId: string | null
    timestamp: Date | null
    userAgent: string | null
    referrer: string | null
  }

  export type PageViewMaxAggregateOutputType = {
    id: string | null
    url: string | null
    userId: string | null
    timestamp: Date | null
    userAgent: string | null
    referrer: string | null
  }

  export type PageViewCountAggregateOutputType = {
    id: number
    url: number
    userId: number
    timestamp: number
    userAgent: number
    referrer: number
    _all: number
  }


  export type PageViewMinAggregateInputType = {
    id?: true
    url?: true
    userId?: true
    timestamp?: true
    userAgent?: true
    referrer?: true
  }

  export type PageViewMaxAggregateInputType = {
    id?: true
    url?: true
    userId?: true
    timestamp?: true
    userAgent?: true
    referrer?: true
  }

  export type PageViewCountAggregateInputType = {
    id?: true
    url?: true
    userId?: true
    timestamp?: true
    userAgent?: true
    referrer?: true
    _all?: true
  }

  export type PageViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageView to aggregate.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PageViews
    **/
    _count?: true | PageViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PageViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PageViewMaxAggregateInputType
  }

  export type GetPageViewAggregateType<T extends PageViewAggregateArgs> = {
        [P in keyof T & keyof AggregatePageView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePageView[P]>
      : GetScalarType<T[P], AggregatePageView[P]>
  }




  export type PageViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageViewWhereInput
    orderBy?: PageViewOrderByWithAggregationInput | PageViewOrderByWithAggregationInput[]
    by: PageViewScalarFieldEnum[] | PageViewScalarFieldEnum
    having?: PageViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PageViewCountAggregateInputType | true
    _min?: PageViewMinAggregateInputType
    _max?: PageViewMaxAggregateInputType
  }

  export type PageViewGroupByOutputType = {
    id: string
    url: string
    userId: string | null
    timestamp: Date
    userAgent: string | null
    referrer: string | null
    _count: PageViewCountAggregateOutputType | null
    _min: PageViewMinAggregateOutputType | null
    _max: PageViewMaxAggregateOutputType | null
  }

  type GetPageViewGroupByPayload<T extends PageViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PageViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PageViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PageViewGroupByOutputType[P]>
            : GetScalarType<T[P], PageViewGroupByOutputType[P]>
        }
      >
    >


  export type PageViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    userId?: boolean
    timestamp?: boolean
    userAgent?: boolean
    referrer?: boolean
    User?: boolean | PageView$UserArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    userId?: boolean
    timestamp?: boolean
    userAgent?: boolean
    referrer?: boolean
    User?: boolean | PageView$UserArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    userId?: boolean
    timestamp?: boolean
    userAgent?: boolean
    referrer?: boolean
    User?: boolean | PageView$UserArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectScalar = {
    id?: boolean
    url?: boolean
    userId?: boolean
    timestamp?: boolean
    userAgent?: boolean
    referrer?: boolean
  }

  export type PageViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "userId" | "timestamp" | "userAgent" | "referrer", ExtArgs["result"]["pageView"]>
  export type PageViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | PageView$UserArgs<ExtArgs>
  }
  export type PageViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | PageView$UserArgs<ExtArgs>
  }
  export type PageViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | PageView$UserArgs<ExtArgs>
  }

  export type $PageViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PageView"
    objects: {
      User: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      userId: string | null
      timestamp: Date
      userAgent: string | null
      referrer: string | null
    }, ExtArgs["result"]["pageView"]>
    composites: {}
  }

  type PageViewGetPayload<S extends boolean | null | undefined | PageViewDefaultArgs> = $Result.GetResult<Prisma.$PageViewPayload, S>

  type PageViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PageViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PageViewCountAggregateInputType | true
    }

  export interface PageViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PageView'], meta: { name: 'PageView' } }
    /**
     * Find zero or one PageView that matches the filter.
     * @param {PageViewFindUniqueArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PageViewFindUniqueArgs>(args: SelectSubset<T, PageViewFindUniqueArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PageView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PageViewFindUniqueOrThrowArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PageViewFindUniqueOrThrowArgs>(args: SelectSubset<T, PageViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PageView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindFirstArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PageViewFindFirstArgs>(args?: SelectSubset<T, PageViewFindFirstArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PageView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindFirstOrThrowArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PageViewFindFirstOrThrowArgs>(args?: SelectSubset<T, PageViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PageViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PageViews
     * const pageViews = await prisma.pageView.findMany()
     * 
     * // Get first 10 PageViews
     * const pageViews = await prisma.pageView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pageViewWithIdOnly = await prisma.pageView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PageViewFindManyArgs>(args?: SelectSubset<T, PageViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PageView.
     * @param {PageViewCreateArgs} args - Arguments to create a PageView.
     * @example
     * // Create one PageView
     * const PageView = await prisma.pageView.create({
     *   data: {
     *     // ... data to create a PageView
     *   }
     * })
     * 
     */
    create<T extends PageViewCreateArgs>(args: SelectSubset<T, PageViewCreateArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PageViews.
     * @param {PageViewCreateManyArgs} args - Arguments to create many PageViews.
     * @example
     * // Create many PageViews
     * const pageView = await prisma.pageView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PageViewCreateManyArgs>(args?: SelectSubset<T, PageViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PageViews and returns the data saved in the database.
     * @param {PageViewCreateManyAndReturnArgs} args - Arguments to create many PageViews.
     * @example
     * // Create many PageViews
     * const pageView = await prisma.pageView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PageViews and only return the `id`
     * const pageViewWithIdOnly = await prisma.pageView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PageViewCreateManyAndReturnArgs>(args?: SelectSubset<T, PageViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PageView.
     * @param {PageViewDeleteArgs} args - Arguments to delete one PageView.
     * @example
     * // Delete one PageView
     * const PageView = await prisma.pageView.delete({
     *   where: {
     *     // ... filter to delete one PageView
     *   }
     * })
     * 
     */
    delete<T extends PageViewDeleteArgs>(args: SelectSubset<T, PageViewDeleteArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PageView.
     * @param {PageViewUpdateArgs} args - Arguments to update one PageView.
     * @example
     * // Update one PageView
     * const pageView = await prisma.pageView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PageViewUpdateArgs>(args: SelectSubset<T, PageViewUpdateArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PageViews.
     * @param {PageViewDeleteManyArgs} args - Arguments to filter PageViews to delete.
     * @example
     * // Delete a few PageViews
     * const { count } = await prisma.pageView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PageViewDeleteManyArgs>(args?: SelectSubset<T, PageViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PageViews
     * const pageView = await prisma.pageView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PageViewUpdateManyArgs>(args: SelectSubset<T, PageViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageViews and returns the data updated in the database.
     * @param {PageViewUpdateManyAndReturnArgs} args - Arguments to update many PageViews.
     * @example
     * // Update many PageViews
     * const pageView = await prisma.pageView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PageViews and only return the `id`
     * const pageViewWithIdOnly = await prisma.pageView.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PageViewUpdateManyAndReturnArgs>(args: SelectSubset<T, PageViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PageView.
     * @param {PageViewUpsertArgs} args - Arguments to update or create a PageView.
     * @example
     * // Update or create a PageView
     * const pageView = await prisma.pageView.upsert({
     *   create: {
     *     // ... data to create a PageView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PageView we want to update
     *   }
     * })
     */
    upsert<T extends PageViewUpsertArgs>(args: SelectSubset<T, PageViewUpsertArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PageViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewCountArgs} args - Arguments to filter PageViews to count.
     * @example
     * // Count the number of PageViews
     * const count = await prisma.pageView.count({
     *   where: {
     *     // ... the filter for the PageViews we want to count
     *   }
     * })
    **/
    count<T extends PageViewCountArgs>(
      args?: Subset<T, PageViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PageViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PageView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PageViewAggregateArgs>(args: Subset<T, PageViewAggregateArgs>): Prisma.PrismaPromise<GetPageViewAggregateType<T>>

    /**
     * Group by PageView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PageViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PageViewGroupByArgs['orderBy'] }
        : { orderBy?: PageViewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PageViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PageView model
   */
  readonly fields: PageViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PageView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PageViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends PageView$UserArgs<ExtArgs> = {}>(args?: Subset<T, PageView$UserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PageView model
   */
  interface PageViewFieldRefs {
    readonly id: FieldRef<"PageView", 'String'>
    readonly url: FieldRef<"PageView", 'String'>
    readonly userId: FieldRef<"PageView", 'String'>
    readonly timestamp: FieldRef<"PageView", 'DateTime'>
    readonly userAgent: FieldRef<"PageView", 'String'>
    readonly referrer: FieldRef<"PageView", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PageView findUnique
   */
  export type PageViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView findUniqueOrThrow
   */
  export type PageViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView findFirst
   */
  export type PageViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageViews.
     */
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView findFirstOrThrow
   */
  export type PageViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageViews.
     */
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView findMany
   */
  export type PageViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageViews to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView create
   */
  export type PageViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The data needed to create a PageView.
     */
    data: XOR<PageViewCreateInput, PageViewUncheckedCreateInput>
  }

  /**
   * PageView createMany
   */
  export type PageViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PageViews.
     */
    data: PageViewCreateManyInput | PageViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PageView createManyAndReturn
   */
  export type PageViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * The data used to create many PageViews.
     */
    data: PageViewCreateManyInput | PageViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PageView update
   */
  export type PageViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The data needed to update a PageView.
     */
    data: XOR<PageViewUpdateInput, PageViewUncheckedUpdateInput>
    /**
     * Choose, which PageView to update.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView updateMany
   */
  export type PageViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PageViews.
     */
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyInput>
    /**
     * Filter which PageViews to update
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to update.
     */
    limit?: number
  }

  /**
   * PageView updateManyAndReturn
   */
  export type PageViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * The data used to update PageViews.
     */
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyInput>
    /**
     * Filter which PageViews to update
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PageView upsert
   */
  export type PageViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The filter to search for the PageView to update in case it exists.
     */
    where: PageViewWhereUniqueInput
    /**
     * In case the PageView found by the `where` argument doesn't exist, create a new PageView with this data.
     */
    create: XOR<PageViewCreateInput, PageViewUncheckedCreateInput>
    /**
     * In case the PageView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PageViewUpdateInput, PageViewUncheckedUpdateInput>
  }

  /**
   * PageView delete
   */
  export type PageViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter which PageView to delete.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView deleteMany
   */
  export type PageViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageViews to delete
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to delete.
     */
    limit?: number
  }

  /**
   * PageView.User
   */
  export type PageView$UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PageView without action
   */
  export type PageViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
  }


  /**
   * Model ErrorLog
   */

  export type AggregateErrorLog = {
    _count: ErrorLogCountAggregateOutputType | null
    _min: ErrorLogMinAggregateOutputType | null
    _max: ErrorLogMaxAggregateOutputType | null
  }

  export type ErrorLogMinAggregateOutputType = {
    id: string | null
    name: string | null
    message: string | null
    stack: string | null
    code: string | null
    userId: string | null
    timestamp: Date | null
    url: string | null
    method: string | null
  }

  export type ErrorLogMaxAggregateOutputType = {
    id: string | null
    name: string | null
    message: string | null
    stack: string | null
    code: string | null
    userId: string | null
    timestamp: Date | null
    url: string | null
    method: string | null
  }

  export type ErrorLogCountAggregateOutputType = {
    id: number
    name: number
    message: number
    stack: number
    code: number
    userId: number
    timestamp: number
    url: number
    method: number
    _all: number
  }


  export type ErrorLogMinAggregateInputType = {
    id?: true
    name?: true
    message?: true
    stack?: true
    code?: true
    userId?: true
    timestamp?: true
    url?: true
    method?: true
  }

  export type ErrorLogMaxAggregateInputType = {
    id?: true
    name?: true
    message?: true
    stack?: true
    code?: true
    userId?: true
    timestamp?: true
    url?: true
    method?: true
  }

  export type ErrorLogCountAggregateInputType = {
    id?: true
    name?: true
    message?: true
    stack?: true
    code?: true
    userId?: true
    timestamp?: true
    url?: true
    method?: true
    _all?: true
  }

  export type ErrorLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ErrorLog to aggregate.
     */
    where?: ErrorLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorLogs to fetch.
     */
    orderBy?: ErrorLogOrderByWithRelationInput | ErrorLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ErrorLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ErrorLogs
    **/
    _count?: true | ErrorLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ErrorLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ErrorLogMaxAggregateInputType
  }

  export type GetErrorLogAggregateType<T extends ErrorLogAggregateArgs> = {
        [P in keyof T & keyof AggregateErrorLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateErrorLog[P]>
      : GetScalarType<T[P], AggregateErrorLog[P]>
  }




  export type ErrorLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ErrorLogWhereInput
    orderBy?: ErrorLogOrderByWithAggregationInput | ErrorLogOrderByWithAggregationInput[]
    by: ErrorLogScalarFieldEnum[] | ErrorLogScalarFieldEnum
    having?: ErrorLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ErrorLogCountAggregateInputType | true
    _min?: ErrorLogMinAggregateInputType
    _max?: ErrorLogMaxAggregateInputType
  }

  export type ErrorLogGroupByOutputType = {
    id: string
    name: string
    message: string
    stack: string | null
    code: string | null
    userId: string | null
    timestamp: Date
    url: string | null
    method: string | null
    _count: ErrorLogCountAggregateOutputType | null
    _min: ErrorLogMinAggregateOutputType | null
    _max: ErrorLogMaxAggregateOutputType | null
  }

  type GetErrorLogGroupByPayload<T extends ErrorLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ErrorLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ErrorLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ErrorLogGroupByOutputType[P]>
            : GetScalarType<T[P], ErrorLogGroupByOutputType[P]>
        }
      >
    >


  export type ErrorLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    message?: boolean
    stack?: boolean
    code?: boolean
    userId?: boolean
    timestamp?: boolean
    url?: boolean
    method?: boolean
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }, ExtArgs["result"]["errorLog"]>

  export type ErrorLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    message?: boolean
    stack?: boolean
    code?: boolean
    userId?: boolean
    timestamp?: boolean
    url?: boolean
    method?: boolean
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }, ExtArgs["result"]["errorLog"]>

  export type ErrorLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    message?: boolean
    stack?: boolean
    code?: boolean
    userId?: boolean
    timestamp?: boolean
    url?: boolean
    method?: boolean
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }, ExtArgs["result"]["errorLog"]>

  export type ErrorLogSelectScalar = {
    id?: boolean
    name?: boolean
    message?: boolean
    stack?: boolean
    code?: boolean
    userId?: boolean
    timestamp?: boolean
    url?: boolean
    method?: boolean
  }

  export type ErrorLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "message" | "stack" | "code" | "userId" | "timestamp" | "url" | "method", ExtArgs["result"]["errorLog"]>
  export type ErrorLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }
  export type ErrorLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }
  export type ErrorLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | ErrorLog$UserArgs<ExtArgs>
  }

  export type $ErrorLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ErrorLog"
    objects: {
      User: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      message: string
      stack: string | null
      code: string | null
      userId: string | null
      timestamp: Date
      url: string | null
      method: string | null
    }, ExtArgs["result"]["errorLog"]>
    composites: {}
  }

  type ErrorLogGetPayload<S extends boolean | null | undefined | ErrorLogDefaultArgs> = $Result.GetResult<Prisma.$ErrorLogPayload, S>

  type ErrorLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ErrorLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ErrorLogCountAggregateInputType | true
    }

  export interface ErrorLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ErrorLog'], meta: { name: 'ErrorLog' } }
    /**
     * Find zero or one ErrorLog that matches the filter.
     * @param {ErrorLogFindUniqueArgs} args - Arguments to find a ErrorLog
     * @example
     * // Get one ErrorLog
     * const errorLog = await prisma.errorLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ErrorLogFindUniqueArgs>(args: SelectSubset<T, ErrorLogFindUniqueArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ErrorLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ErrorLogFindUniqueOrThrowArgs} args - Arguments to find a ErrorLog
     * @example
     * // Get one ErrorLog
     * const errorLog = await prisma.errorLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ErrorLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ErrorLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ErrorLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogFindFirstArgs} args - Arguments to find a ErrorLog
     * @example
     * // Get one ErrorLog
     * const errorLog = await prisma.errorLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ErrorLogFindFirstArgs>(args?: SelectSubset<T, ErrorLogFindFirstArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ErrorLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogFindFirstOrThrowArgs} args - Arguments to find a ErrorLog
     * @example
     * // Get one ErrorLog
     * const errorLog = await prisma.errorLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ErrorLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ErrorLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ErrorLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ErrorLogs
     * const errorLogs = await prisma.errorLog.findMany()
     * 
     * // Get first 10 ErrorLogs
     * const errorLogs = await prisma.errorLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const errorLogWithIdOnly = await prisma.errorLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ErrorLogFindManyArgs>(args?: SelectSubset<T, ErrorLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ErrorLog.
     * @param {ErrorLogCreateArgs} args - Arguments to create a ErrorLog.
     * @example
     * // Create one ErrorLog
     * const ErrorLog = await prisma.errorLog.create({
     *   data: {
     *     // ... data to create a ErrorLog
     *   }
     * })
     * 
     */
    create<T extends ErrorLogCreateArgs>(args: SelectSubset<T, ErrorLogCreateArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ErrorLogs.
     * @param {ErrorLogCreateManyArgs} args - Arguments to create many ErrorLogs.
     * @example
     * // Create many ErrorLogs
     * const errorLog = await prisma.errorLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ErrorLogCreateManyArgs>(args?: SelectSubset<T, ErrorLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ErrorLogs and returns the data saved in the database.
     * @param {ErrorLogCreateManyAndReturnArgs} args - Arguments to create many ErrorLogs.
     * @example
     * // Create many ErrorLogs
     * const errorLog = await prisma.errorLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ErrorLogs and only return the `id`
     * const errorLogWithIdOnly = await prisma.errorLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ErrorLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ErrorLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ErrorLog.
     * @param {ErrorLogDeleteArgs} args - Arguments to delete one ErrorLog.
     * @example
     * // Delete one ErrorLog
     * const ErrorLog = await prisma.errorLog.delete({
     *   where: {
     *     // ... filter to delete one ErrorLog
     *   }
     * })
     * 
     */
    delete<T extends ErrorLogDeleteArgs>(args: SelectSubset<T, ErrorLogDeleteArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ErrorLog.
     * @param {ErrorLogUpdateArgs} args - Arguments to update one ErrorLog.
     * @example
     * // Update one ErrorLog
     * const errorLog = await prisma.errorLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ErrorLogUpdateArgs>(args: SelectSubset<T, ErrorLogUpdateArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ErrorLogs.
     * @param {ErrorLogDeleteManyArgs} args - Arguments to filter ErrorLogs to delete.
     * @example
     * // Delete a few ErrorLogs
     * const { count } = await prisma.errorLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ErrorLogDeleteManyArgs>(args?: SelectSubset<T, ErrorLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ErrorLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ErrorLogs
     * const errorLog = await prisma.errorLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ErrorLogUpdateManyArgs>(args: SelectSubset<T, ErrorLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ErrorLogs and returns the data updated in the database.
     * @param {ErrorLogUpdateManyAndReturnArgs} args - Arguments to update many ErrorLogs.
     * @example
     * // Update many ErrorLogs
     * const errorLog = await prisma.errorLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ErrorLogs and only return the `id`
     * const errorLogWithIdOnly = await prisma.errorLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ErrorLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ErrorLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ErrorLog.
     * @param {ErrorLogUpsertArgs} args - Arguments to update or create a ErrorLog.
     * @example
     * // Update or create a ErrorLog
     * const errorLog = await prisma.errorLog.upsert({
     *   create: {
     *     // ... data to create a ErrorLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ErrorLog we want to update
     *   }
     * })
     */
    upsert<T extends ErrorLogUpsertArgs>(args: SelectSubset<T, ErrorLogUpsertArgs<ExtArgs>>): Prisma__ErrorLogClient<$Result.GetResult<Prisma.$ErrorLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ErrorLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogCountArgs} args - Arguments to filter ErrorLogs to count.
     * @example
     * // Count the number of ErrorLogs
     * const count = await prisma.errorLog.count({
     *   where: {
     *     // ... the filter for the ErrorLogs we want to count
     *   }
     * })
    **/
    count<T extends ErrorLogCountArgs>(
      args?: Subset<T, ErrorLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ErrorLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ErrorLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ErrorLogAggregateArgs>(args: Subset<T, ErrorLogAggregateArgs>): Prisma.PrismaPromise<GetErrorLogAggregateType<T>>

    /**
     * Group by ErrorLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ErrorLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ErrorLogGroupByArgs['orderBy'] }
        : { orderBy?: ErrorLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ErrorLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetErrorLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ErrorLog model
   */
  readonly fields: ErrorLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ErrorLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ErrorLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends ErrorLog$UserArgs<ExtArgs> = {}>(args?: Subset<T, ErrorLog$UserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ErrorLog model
   */
  interface ErrorLogFieldRefs {
    readonly id: FieldRef<"ErrorLog", 'String'>
    readonly name: FieldRef<"ErrorLog", 'String'>
    readonly message: FieldRef<"ErrorLog", 'String'>
    readonly stack: FieldRef<"ErrorLog", 'String'>
    readonly code: FieldRef<"ErrorLog", 'String'>
    readonly userId: FieldRef<"ErrorLog", 'String'>
    readonly timestamp: FieldRef<"ErrorLog", 'DateTime'>
    readonly url: FieldRef<"ErrorLog", 'String'>
    readonly method: FieldRef<"ErrorLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ErrorLog findUnique
   */
  export type ErrorLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter, which ErrorLog to fetch.
     */
    where: ErrorLogWhereUniqueInput
  }

  /**
   * ErrorLog findUniqueOrThrow
   */
  export type ErrorLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter, which ErrorLog to fetch.
     */
    where: ErrorLogWhereUniqueInput
  }

  /**
   * ErrorLog findFirst
   */
  export type ErrorLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter, which ErrorLog to fetch.
     */
    where?: ErrorLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorLogs to fetch.
     */
    orderBy?: ErrorLogOrderByWithRelationInput | ErrorLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ErrorLogs.
     */
    cursor?: ErrorLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ErrorLogs.
     */
    distinct?: ErrorLogScalarFieldEnum | ErrorLogScalarFieldEnum[]
  }

  /**
   * ErrorLog findFirstOrThrow
   */
  export type ErrorLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter, which ErrorLog to fetch.
     */
    where?: ErrorLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorLogs to fetch.
     */
    orderBy?: ErrorLogOrderByWithRelationInput | ErrorLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ErrorLogs.
     */
    cursor?: ErrorLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ErrorLogs.
     */
    distinct?: ErrorLogScalarFieldEnum | ErrorLogScalarFieldEnum[]
  }

  /**
   * ErrorLog findMany
   */
  export type ErrorLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter, which ErrorLogs to fetch.
     */
    where?: ErrorLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorLogs to fetch.
     */
    orderBy?: ErrorLogOrderByWithRelationInput | ErrorLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ErrorLogs.
     */
    cursor?: ErrorLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorLogs.
     */
    skip?: number
    distinct?: ErrorLogScalarFieldEnum | ErrorLogScalarFieldEnum[]
  }

  /**
   * ErrorLog create
   */
  export type ErrorLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ErrorLog.
     */
    data: XOR<ErrorLogCreateInput, ErrorLogUncheckedCreateInput>
  }

  /**
   * ErrorLog createMany
   */
  export type ErrorLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ErrorLogs.
     */
    data: ErrorLogCreateManyInput | ErrorLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ErrorLog createManyAndReturn
   */
  export type ErrorLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * The data used to create many ErrorLogs.
     */
    data: ErrorLogCreateManyInput | ErrorLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ErrorLog update
   */
  export type ErrorLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ErrorLog.
     */
    data: XOR<ErrorLogUpdateInput, ErrorLogUncheckedUpdateInput>
    /**
     * Choose, which ErrorLog to update.
     */
    where: ErrorLogWhereUniqueInput
  }

  /**
   * ErrorLog updateMany
   */
  export type ErrorLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ErrorLogs.
     */
    data: XOR<ErrorLogUpdateManyMutationInput, ErrorLogUncheckedUpdateManyInput>
    /**
     * Filter which ErrorLogs to update
     */
    where?: ErrorLogWhereInput
    /**
     * Limit how many ErrorLogs to update.
     */
    limit?: number
  }

  /**
   * ErrorLog updateManyAndReturn
   */
  export type ErrorLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * The data used to update ErrorLogs.
     */
    data: XOR<ErrorLogUpdateManyMutationInput, ErrorLogUncheckedUpdateManyInput>
    /**
     * Filter which ErrorLogs to update
     */
    where?: ErrorLogWhereInput
    /**
     * Limit how many ErrorLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ErrorLog upsert
   */
  export type ErrorLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ErrorLog to update in case it exists.
     */
    where: ErrorLogWhereUniqueInput
    /**
     * In case the ErrorLog found by the `where` argument doesn't exist, create a new ErrorLog with this data.
     */
    create: XOR<ErrorLogCreateInput, ErrorLogUncheckedCreateInput>
    /**
     * In case the ErrorLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ErrorLogUpdateInput, ErrorLogUncheckedUpdateInput>
  }

  /**
   * ErrorLog delete
   */
  export type ErrorLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
    /**
     * Filter which ErrorLog to delete.
     */
    where: ErrorLogWhereUniqueInput
  }

  /**
   * ErrorLog deleteMany
   */
  export type ErrorLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ErrorLogs to delete
     */
    where?: ErrorLogWhereInput
    /**
     * Limit how many ErrorLogs to delete.
     */
    limit?: number
  }

  /**
   * ErrorLog.User
   */
  export type ErrorLog$UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ErrorLog without action
   */
  export type ErrorLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorLog
     */
    select?: ErrorLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorLog
     */
    omit?: ErrorLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ErrorLogInclude<ExtArgs> | null
  }


  /**
   * Model PerformanceMetric
   */

  export type AggregatePerformanceMetric = {
    _count: PerformanceMetricCountAggregateOutputType | null
    _avg: PerformanceMetricAvgAggregateOutputType | null
    _sum: PerformanceMetricSumAggregateOutputType | null
    _min: PerformanceMetricMinAggregateOutputType | null
    _max: PerformanceMetricMaxAggregateOutputType | null
  }

  export type PerformanceMetricAvgAggregateOutputType = {
    duration: number | null
  }

  export type PerformanceMetricSumAggregateOutputType = {
    duration: number | null
  }

  export type PerformanceMetricMinAggregateOutputType = {
    id: string | null
    type: string | null
    duration: number | null
    timestamp: Date | null
  }

  export type PerformanceMetricMaxAggregateOutputType = {
    id: string | null
    type: string | null
    duration: number | null
    timestamp: Date | null
  }

  export type PerformanceMetricCountAggregateOutputType = {
    id: number
    type: number
    duration: number
    details: number
    timestamp: number
    _all: number
  }


  export type PerformanceMetricAvgAggregateInputType = {
    duration?: true
  }

  export type PerformanceMetricSumAggregateInputType = {
    duration?: true
  }

  export type PerformanceMetricMinAggregateInputType = {
    id?: true
    type?: true
    duration?: true
    timestamp?: true
  }

  export type PerformanceMetricMaxAggregateInputType = {
    id?: true
    type?: true
    duration?: true
    timestamp?: true
  }

  export type PerformanceMetricCountAggregateInputType = {
    id?: true
    type?: true
    duration?: true
    details?: true
    timestamp?: true
    _all?: true
  }

  export type PerformanceMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PerformanceMetric to aggregate.
     */
    where?: PerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceMetrics to fetch.
     */
    orderBy?: PerformanceMetricOrderByWithRelationInput | PerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PerformanceMetrics
    **/
    _count?: true | PerformanceMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PerformanceMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PerformanceMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerformanceMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerformanceMetricMaxAggregateInputType
  }

  export type GetPerformanceMetricAggregateType<T extends PerformanceMetricAggregateArgs> = {
        [P in keyof T & keyof AggregatePerformanceMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePerformanceMetric[P]>
      : GetScalarType<T[P], AggregatePerformanceMetric[P]>
  }




  export type PerformanceMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerformanceMetricWhereInput
    orderBy?: PerformanceMetricOrderByWithAggregationInput | PerformanceMetricOrderByWithAggregationInput[]
    by: PerformanceMetricScalarFieldEnum[] | PerformanceMetricScalarFieldEnum
    having?: PerformanceMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerformanceMetricCountAggregateInputType | true
    _avg?: PerformanceMetricAvgAggregateInputType
    _sum?: PerformanceMetricSumAggregateInputType
    _min?: PerformanceMetricMinAggregateInputType
    _max?: PerformanceMetricMaxAggregateInputType
  }

  export type PerformanceMetricGroupByOutputType = {
    id: string
    type: string
    duration: number
    details: JsonValue | null
    timestamp: Date
    _count: PerformanceMetricCountAggregateOutputType | null
    _avg: PerformanceMetricAvgAggregateOutputType | null
    _sum: PerformanceMetricSumAggregateOutputType | null
    _min: PerformanceMetricMinAggregateOutputType | null
    _max: PerformanceMetricMaxAggregateOutputType | null
  }

  type GetPerformanceMetricGroupByPayload<T extends PerformanceMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerformanceMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerformanceMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerformanceMetricGroupByOutputType[P]>
            : GetScalarType<T[P], PerformanceMetricGroupByOutputType[P]>
        }
      >
    >


  export type PerformanceMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    duration?: boolean
    details?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["performanceMetric"]>

  export type PerformanceMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    duration?: boolean
    details?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["performanceMetric"]>

  export type PerformanceMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    duration?: boolean
    details?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["performanceMetric"]>

  export type PerformanceMetricSelectScalar = {
    id?: boolean
    type?: boolean
    duration?: boolean
    details?: boolean
    timestamp?: boolean
  }

  export type PerformanceMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "duration" | "details" | "timestamp", ExtArgs["result"]["performanceMetric"]>

  export type $PerformanceMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PerformanceMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      duration: number
      details: Prisma.JsonValue | null
      timestamp: Date
    }, ExtArgs["result"]["performanceMetric"]>
    composites: {}
  }

  type PerformanceMetricGetPayload<S extends boolean | null | undefined | PerformanceMetricDefaultArgs> = $Result.GetResult<Prisma.$PerformanceMetricPayload, S>

  type PerformanceMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PerformanceMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PerformanceMetricCountAggregateInputType | true
    }

  export interface PerformanceMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PerformanceMetric'], meta: { name: 'PerformanceMetric' } }
    /**
     * Find zero or one PerformanceMetric that matches the filter.
     * @param {PerformanceMetricFindUniqueArgs} args - Arguments to find a PerformanceMetric
     * @example
     * // Get one PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PerformanceMetricFindUniqueArgs>(args: SelectSubset<T, PerformanceMetricFindUniqueArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PerformanceMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PerformanceMetricFindUniqueOrThrowArgs} args - Arguments to find a PerformanceMetric
     * @example
     * // Get one PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PerformanceMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, PerformanceMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PerformanceMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricFindFirstArgs} args - Arguments to find a PerformanceMetric
     * @example
     * // Get one PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PerformanceMetricFindFirstArgs>(args?: SelectSubset<T, PerformanceMetricFindFirstArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PerformanceMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricFindFirstOrThrowArgs} args - Arguments to find a PerformanceMetric
     * @example
     * // Get one PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PerformanceMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, PerformanceMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PerformanceMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PerformanceMetrics
     * const performanceMetrics = await prisma.performanceMetric.findMany()
     * 
     * // Get first 10 PerformanceMetrics
     * const performanceMetrics = await prisma.performanceMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const performanceMetricWithIdOnly = await prisma.performanceMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PerformanceMetricFindManyArgs>(args?: SelectSubset<T, PerformanceMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PerformanceMetric.
     * @param {PerformanceMetricCreateArgs} args - Arguments to create a PerformanceMetric.
     * @example
     * // Create one PerformanceMetric
     * const PerformanceMetric = await prisma.performanceMetric.create({
     *   data: {
     *     // ... data to create a PerformanceMetric
     *   }
     * })
     * 
     */
    create<T extends PerformanceMetricCreateArgs>(args: SelectSubset<T, PerformanceMetricCreateArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PerformanceMetrics.
     * @param {PerformanceMetricCreateManyArgs} args - Arguments to create many PerformanceMetrics.
     * @example
     * // Create many PerformanceMetrics
     * const performanceMetric = await prisma.performanceMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PerformanceMetricCreateManyArgs>(args?: SelectSubset<T, PerformanceMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PerformanceMetrics and returns the data saved in the database.
     * @param {PerformanceMetricCreateManyAndReturnArgs} args - Arguments to create many PerformanceMetrics.
     * @example
     * // Create many PerformanceMetrics
     * const performanceMetric = await prisma.performanceMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PerformanceMetrics and only return the `id`
     * const performanceMetricWithIdOnly = await prisma.performanceMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PerformanceMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, PerformanceMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PerformanceMetric.
     * @param {PerformanceMetricDeleteArgs} args - Arguments to delete one PerformanceMetric.
     * @example
     * // Delete one PerformanceMetric
     * const PerformanceMetric = await prisma.performanceMetric.delete({
     *   where: {
     *     // ... filter to delete one PerformanceMetric
     *   }
     * })
     * 
     */
    delete<T extends PerformanceMetricDeleteArgs>(args: SelectSubset<T, PerformanceMetricDeleteArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PerformanceMetric.
     * @param {PerformanceMetricUpdateArgs} args - Arguments to update one PerformanceMetric.
     * @example
     * // Update one PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PerformanceMetricUpdateArgs>(args: SelectSubset<T, PerformanceMetricUpdateArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PerformanceMetrics.
     * @param {PerformanceMetricDeleteManyArgs} args - Arguments to filter PerformanceMetrics to delete.
     * @example
     * // Delete a few PerformanceMetrics
     * const { count } = await prisma.performanceMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PerformanceMetricDeleteManyArgs>(args?: SelectSubset<T, PerformanceMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PerformanceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PerformanceMetrics
     * const performanceMetric = await prisma.performanceMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PerformanceMetricUpdateManyArgs>(args: SelectSubset<T, PerformanceMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PerformanceMetrics and returns the data updated in the database.
     * @param {PerformanceMetricUpdateManyAndReturnArgs} args - Arguments to update many PerformanceMetrics.
     * @example
     * // Update many PerformanceMetrics
     * const performanceMetric = await prisma.performanceMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PerformanceMetrics and only return the `id`
     * const performanceMetricWithIdOnly = await prisma.performanceMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PerformanceMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, PerformanceMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PerformanceMetric.
     * @param {PerformanceMetricUpsertArgs} args - Arguments to update or create a PerformanceMetric.
     * @example
     * // Update or create a PerformanceMetric
     * const performanceMetric = await prisma.performanceMetric.upsert({
     *   create: {
     *     // ... data to create a PerformanceMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PerformanceMetric we want to update
     *   }
     * })
     */
    upsert<T extends PerformanceMetricUpsertArgs>(args: SelectSubset<T, PerformanceMetricUpsertArgs<ExtArgs>>): Prisma__PerformanceMetricClient<$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PerformanceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricCountArgs} args - Arguments to filter PerformanceMetrics to count.
     * @example
     * // Count the number of PerformanceMetrics
     * const count = await prisma.performanceMetric.count({
     *   where: {
     *     // ... the filter for the PerformanceMetrics we want to count
     *   }
     * })
    **/
    count<T extends PerformanceMetricCountArgs>(
      args?: Subset<T, PerformanceMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerformanceMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PerformanceMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerformanceMetricAggregateArgs>(args: Subset<T, PerformanceMetricAggregateArgs>): Prisma.PrismaPromise<GetPerformanceMetricAggregateType<T>>

    /**
     * Group by PerformanceMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PerformanceMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PerformanceMetricGroupByArgs['orderBy'] }
        : { orderBy?: PerformanceMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PerformanceMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerformanceMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PerformanceMetric model
   */
  readonly fields: PerformanceMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PerformanceMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PerformanceMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PerformanceMetric model
   */
  interface PerformanceMetricFieldRefs {
    readonly id: FieldRef<"PerformanceMetric", 'String'>
    readonly type: FieldRef<"PerformanceMetric", 'String'>
    readonly duration: FieldRef<"PerformanceMetric", 'Float'>
    readonly details: FieldRef<"PerformanceMetric", 'Json'>
    readonly timestamp: FieldRef<"PerformanceMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PerformanceMetric findUnique
   */
  export type PerformanceMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which PerformanceMetric to fetch.
     */
    where: PerformanceMetricWhereUniqueInput
  }

  /**
   * PerformanceMetric findUniqueOrThrow
   */
  export type PerformanceMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which PerformanceMetric to fetch.
     */
    where: PerformanceMetricWhereUniqueInput
  }

  /**
   * PerformanceMetric findFirst
   */
  export type PerformanceMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which PerformanceMetric to fetch.
     */
    where?: PerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceMetrics to fetch.
     */
    orderBy?: PerformanceMetricOrderByWithRelationInput | PerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PerformanceMetrics.
     */
    cursor?: PerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PerformanceMetrics.
     */
    distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[]
  }

  /**
   * PerformanceMetric findFirstOrThrow
   */
  export type PerformanceMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which PerformanceMetric to fetch.
     */
    where?: PerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceMetrics to fetch.
     */
    orderBy?: PerformanceMetricOrderByWithRelationInput | PerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PerformanceMetrics.
     */
    cursor?: PerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PerformanceMetrics.
     */
    distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[]
  }

  /**
   * PerformanceMetric findMany
   */
  export type PerformanceMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which PerformanceMetrics to fetch.
     */
    where?: PerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceMetrics to fetch.
     */
    orderBy?: PerformanceMetricOrderByWithRelationInput | PerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PerformanceMetrics.
     */
    cursor?: PerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceMetrics.
     */
    skip?: number
    distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[]
  }

  /**
   * PerformanceMetric create
   */
  export type PerformanceMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * The data needed to create a PerformanceMetric.
     */
    data: XOR<PerformanceMetricCreateInput, PerformanceMetricUncheckedCreateInput>
  }

  /**
   * PerformanceMetric createMany
   */
  export type PerformanceMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PerformanceMetrics.
     */
    data: PerformanceMetricCreateManyInput | PerformanceMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PerformanceMetric createManyAndReturn
   */
  export type PerformanceMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * The data used to create many PerformanceMetrics.
     */
    data: PerformanceMetricCreateManyInput | PerformanceMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PerformanceMetric update
   */
  export type PerformanceMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * The data needed to update a PerformanceMetric.
     */
    data: XOR<PerformanceMetricUpdateInput, PerformanceMetricUncheckedUpdateInput>
    /**
     * Choose, which PerformanceMetric to update.
     */
    where: PerformanceMetricWhereUniqueInput
  }

  /**
   * PerformanceMetric updateMany
   */
  export type PerformanceMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PerformanceMetrics.
     */
    data: XOR<PerformanceMetricUpdateManyMutationInput, PerformanceMetricUncheckedUpdateManyInput>
    /**
     * Filter which PerformanceMetrics to update
     */
    where?: PerformanceMetricWhereInput
    /**
     * Limit how many PerformanceMetrics to update.
     */
    limit?: number
  }

  /**
   * PerformanceMetric updateManyAndReturn
   */
  export type PerformanceMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * The data used to update PerformanceMetrics.
     */
    data: XOR<PerformanceMetricUpdateManyMutationInput, PerformanceMetricUncheckedUpdateManyInput>
    /**
     * Filter which PerformanceMetrics to update
     */
    where?: PerformanceMetricWhereInput
    /**
     * Limit how many PerformanceMetrics to update.
     */
    limit?: number
  }

  /**
   * PerformanceMetric upsert
   */
  export type PerformanceMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * The filter to search for the PerformanceMetric to update in case it exists.
     */
    where: PerformanceMetricWhereUniqueInput
    /**
     * In case the PerformanceMetric found by the `where` argument doesn't exist, create a new PerformanceMetric with this data.
     */
    create: XOR<PerformanceMetricCreateInput, PerformanceMetricUncheckedCreateInput>
    /**
     * In case the PerformanceMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PerformanceMetricUpdateInput, PerformanceMetricUncheckedUpdateInput>
  }

  /**
   * PerformanceMetric delete
   */
  export type PerformanceMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter which PerformanceMetric to delete.
     */
    where: PerformanceMetricWhereUniqueInput
  }

  /**
   * PerformanceMetric deleteMany
   */
  export type PerformanceMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PerformanceMetrics to delete
     */
    where?: PerformanceMetricWhereInput
    /**
     * Limit how many PerformanceMetrics to delete.
     */
    limit?: number
  }

  /**
   * PerformanceMetric without action
   */
  export type PerformanceMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceMetric
     */
    select?: PerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PerformanceMetric
     */
    omit?: PerformanceMetricOmit<ExtArgs> | null
  }


  /**
   * Model MetricsSnapshot
   */

  export type AggregateMetricsSnapshot = {
    _count: MetricsSnapshotCountAggregateOutputType | null
    _avg: MetricsSnapshotAvgAggregateOutputType | null
    _sum: MetricsSnapshotSumAggregateOutputType | null
    _min: MetricsSnapshotMinAggregateOutputType | null
    _max: MetricsSnapshotMaxAggregateOutputType | null
  }

  export type MetricsSnapshotAvgAggregateOutputType = {
    activeUsers: number | null
  }

  export type MetricsSnapshotSumAggregateOutputType = {
    activeUsers: number | null
  }

  export type MetricsSnapshotMinAggregateOutputType = {
    id: string | null
    activeUsers: number | null
    timestamp: Date | null
  }

  export type MetricsSnapshotMaxAggregateOutputType = {
    id: string | null
    activeUsers: number | null
    timestamp: Date | null
  }

  export type MetricsSnapshotCountAggregateOutputType = {
    id: number
    activeUsers: number
    pageViews: number
    errors: number
    performance: number
    timestamp: number
    _all: number
  }


  export type MetricsSnapshotAvgAggregateInputType = {
    activeUsers?: true
  }

  export type MetricsSnapshotSumAggregateInputType = {
    activeUsers?: true
  }

  export type MetricsSnapshotMinAggregateInputType = {
    id?: true
    activeUsers?: true
    timestamp?: true
  }

  export type MetricsSnapshotMaxAggregateInputType = {
    id?: true
    activeUsers?: true
    timestamp?: true
  }

  export type MetricsSnapshotCountAggregateInputType = {
    id?: true
    activeUsers?: true
    pageViews?: true
    errors?: true
    performance?: true
    timestamp?: true
    _all?: true
  }

  export type MetricsSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetricsSnapshot to aggregate.
     */
    where?: MetricsSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricsSnapshots to fetch.
     */
    orderBy?: MetricsSnapshotOrderByWithRelationInput | MetricsSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetricsSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricsSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricsSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MetricsSnapshots
    **/
    _count?: true | MetricsSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MetricsSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MetricsSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetricsSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetricsSnapshotMaxAggregateInputType
  }

  export type GetMetricsSnapshotAggregateType<T extends MetricsSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateMetricsSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetricsSnapshot[P]>
      : GetScalarType<T[P], AggregateMetricsSnapshot[P]>
  }




  export type MetricsSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetricsSnapshotWhereInput
    orderBy?: MetricsSnapshotOrderByWithAggregationInput | MetricsSnapshotOrderByWithAggregationInput[]
    by: MetricsSnapshotScalarFieldEnum[] | MetricsSnapshotScalarFieldEnum
    having?: MetricsSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetricsSnapshotCountAggregateInputType | true
    _avg?: MetricsSnapshotAvgAggregateInputType
    _sum?: MetricsSnapshotSumAggregateInputType
    _min?: MetricsSnapshotMinAggregateInputType
    _max?: MetricsSnapshotMaxAggregateInputType
  }

  export type MetricsSnapshotGroupByOutputType = {
    id: string
    activeUsers: number
    pageViews: JsonValue
    errors: JsonValue
    performance: JsonValue
    timestamp: Date
    _count: MetricsSnapshotCountAggregateOutputType | null
    _avg: MetricsSnapshotAvgAggregateOutputType | null
    _sum: MetricsSnapshotSumAggregateOutputType | null
    _min: MetricsSnapshotMinAggregateOutputType | null
    _max: MetricsSnapshotMaxAggregateOutputType | null
  }

  type GetMetricsSnapshotGroupByPayload<T extends MetricsSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetricsSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetricsSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetricsSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], MetricsSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type MetricsSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activeUsers?: boolean
    pageViews?: boolean
    errors?: boolean
    performance?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["metricsSnapshot"]>

  export type MetricsSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activeUsers?: boolean
    pageViews?: boolean
    errors?: boolean
    performance?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["metricsSnapshot"]>

  export type MetricsSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activeUsers?: boolean
    pageViews?: boolean
    errors?: boolean
    performance?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["metricsSnapshot"]>

  export type MetricsSnapshotSelectScalar = {
    id?: boolean
    activeUsers?: boolean
    pageViews?: boolean
    errors?: boolean
    performance?: boolean
    timestamp?: boolean
  }

  export type MetricsSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "activeUsers" | "pageViews" | "errors" | "performance" | "timestamp", ExtArgs["result"]["metricsSnapshot"]>

  export type $MetricsSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MetricsSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      activeUsers: number
      pageViews: Prisma.JsonValue
      errors: Prisma.JsonValue
      performance: Prisma.JsonValue
      timestamp: Date
    }, ExtArgs["result"]["metricsSnapshot"]>
    composites: {}
  }

  type MetricsSnapshotGetPayload<S extends boolean | null | undefined | MetricsSnapshotDefaultArgs> = $Result.GetResult<Prisma.$MetricsSnapshotPayload, S>

  type MetricsSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetricsSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetricsSnapshotCountAggregateInputType | true
    }

  export interface MetricsSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MetricsSnapshot'], meta: { name: 'MetricsSnapshot' } }
    /**
     * Find zero or one MetricsSnapshot that matches the filter.
     * @param {MetricsSnapshotFindUniqueArgs} args - Arguments to find a MetricsSnapshot
     * @example
     * // Get one MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetricsSnapshotFindUniqueArgs>(args: SelectSubset<T, MetricsSnapshotFindUniqueArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MetricsSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetricsSnapshotFindUniqueOrThrowArgs} args - Arguments to find a MetricsSnapshot
     * @example
     * // Get one MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetricsSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, MetricsSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetricsSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotFindFirstArgs} args - Arguments to find a MetricsSnapshot
     * @example
     * // Get one MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetricsSnapshotFindFirstArgs>(args?: SelectSubset<T, MetricsSnapshotFindFirstArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetricsSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotFindFirstOrThrowArgs} args - Arguments to find a MetricsSnapshot
     * @example
     * // Get one MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetricsSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, MetricsSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MetricsSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MetricsSnapshots
     * const metricsSnapshots = await prisma.metricsSnapshot.findMany()
     * 
     * // Get first 10 MetricsSnapshots
     * const metricsSnapshots = await prisma.metricsSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metricsSnapshotWithIdOnly = await prisma.metricsSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetricsSnapshotFindManyArgs>(args?: SelectSubset<T, MetricsSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MetricsSnapshot.
     * @param {MetricsSnapshotCreateArgs} args - Arguments to create a MetricsSnapshot.
     * @example
     * // Create one MetricsSnapshot
     * const MetricsSnapshot = await prisma.metricsSnapshot.create({
     *   data: {
     *     // ... data to create a MetricsSnapshot
     *   }
     * })
     * 
     */
    create<T extends MetricsSnapshotCreateArgs>(args: SelectSubset<T, MetricsSnapshotCreateArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MetricsSnapshots.
     * @param {MetricsSnapshotCreateManyArgs} args - Arguments to create many MetricsSnapshots.
     * @example
     * // Create many MetricsSnapshots
     * const metricsSnapshot = await prisma.metricsSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetricsSnapshotCreateManyArgs>(args?: SelectSubset<T, MetricsSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MetricsSnapshots and returns the data saved in the database.
     * @param {MetricsSnapshotCreateManyAndReturnArgs} args - Arguments to create many MetricsSnapshots.
     * @example
     * // Create many MetricsSnapshots
     * const metricsSnapshot = await prisma.metricsSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MetricsSnapshots and only return the `id`
     * const metricsSnapshotWithIdOnly = await prisma.metricsSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetricsSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, MetricsSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MetricsSnapshot.
     * @param {MetricsSnapshotDeleteArgs} args - Arguments to delete one MetricsSnapshot.
     * @example
     * // Delete one MetricsSnapshot
     * const MetricsSnapshot = await prisma.metricsSnapshot.delete({
     *   where: {
     *     // ... filter to delete one MetricsSnapshot
     *   }
     * })
     * 
     */
    delete<T extends MetricsSnapshotDeleteArgs>(args: SelectSubset<T, MetricsSnapshotDeleteArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MetricsSnapshot.
     * @param {MetricsSnapshotUpdateArgs} args - Arguments to update one MetricsSnapshot.
     * @example
     * // Update one MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetricsSnapshotUpdateArgs>(args: SelectSubset<T, MetricsSnapshotUpdateArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MetricsSnapshots.
     * @param {MetricsSnapshotDeleteManyArgs} args - Arguments to filter MetricsSnapshots to delete.
     * @example
     * // Delete a few MetricsSnapshots
     * const { count } = await prisma.metricsSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetricsSnapshotDeleteManyArgs>(args?: SelectSubset<T, MetricsSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetricsSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MetricsSnapshots
     * const metricsSnapshot = await prisma.metricsSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetricsSnapshotUpdateManyArgs>(args: SelectSubset<T, MetricsSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetricsSnapshots and returns the data updated in the database.
     * @param {MetricsSnapshotUpdateManyAndReturnArgs} args - Arguments to update many MetricsSnapshots.
     * @example
     * // Update many MetricsSnapshots
     * const metricsSnapshot = await prisma.metricsSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MetricsSnapshots and only return the `id`
     * const metricsSnapshotWithIdOnly = await prisma.metricsSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetricsSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, MetricsSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MetricsSnapshot.
     * @param {MetricsSnapshotUpsertArgs} args - Arguments to update or create a MetricsSnapshot.
     * @example
     * // Update or create a MetricsSnapshot
     * const metricsSnapshot = await prisma.metricsSnapshot.upsert({
     *   create: {
     *     // ... data to create a MetricsSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MetricsSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends MetricsSnapshotUpsertArgs>(args: SelectSubset<T, MetricsSnapshotUpsertArgs<ExtArgs>>): Prisma__MetricsSnapshotClient<$Result.GetResult<Prisma.$MetricsSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MetricsSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotCountArgs} args - Arguments to filter MetricsSnapshots to count.
     * @example
     * // Count the number of MetricsSnapshots
     * const count = await prisma.metricsSnapshot.count({
     *   where: {
     *     // ... the filter for the MetricsSnapshots we want to count
     *   }
     * })
    **/
    count<T extends MetricsSnapshotCountArgs>(
      args?: Subset<T, MetricsSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetricsSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MetricsSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetricsSnapshotAggregateArgs>(args: Subset<T, MetricsSnapshotAggregateArgs>): Prisma.PrismaPromise<GetMetricsSnapshotAggregateType<T>>

    /**
     * Group by MetricsSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricsSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetricsSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetricsSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: MetricsSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetricsSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetricsSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MetricsSnapshot model
   */
  readonly fields: MetricsSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MetricsSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetricsSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MetricsSnapshot model
   */
  interface MetricsSnapshotFieldRefs {
    readonly id: FieldRef<"MetricsSnapshot", 'String'>
    readonly activeUsers: FieldRef<"MetricsSnapshot", 'Int'>
    readonly pageViews: FieldRef<"MetricsSnapshot", 'Json'>
    readonly errors: FieldRef<"MetricsSnapshot", 'Json'>
    readonly performance: FieldRef<"MetricsSnapshot", 'Json'>
    readonly timestamp: FieldRef<"MetricsSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MetricsSnapshot findUnique
   */
  export type MetricsSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which MetricsSnapshot to fetch.
     */
    where: MetricsSnapshotWhereUniqueInput
  }

  /**
   * MetricsSnapshot findUniqueOrThrow
   */
  export type MetricsSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which MetricsSnapshot to fetch.
     */
    where: MetricsSnapshotWhereUniqueInput
  }

  /**
   * MetricsSnapshot findFirst
   */
  export type MetricsSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which MetricsSnapshot to fetch.
     */
    where?: MetricsSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricsSnapshots to fetch.
     */
    orderBy?: MetricsSnapshotOrderByWithRelationInput | MetricsSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetricsSnapshots.
     */
    cursor?: MetricsSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricsSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricsSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetricsSnapshots.
     */
    distinct?: MetricsSnapshotScalarFieldEnum | MetricsSnapshotScalarFieldEnum[]
  }

  /**
   * MetricsSnapshot findFirstOrThrow
   */
  export type MetricsSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which MetricsSnapshot to fetch.
     */
    where?: MetricsSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricsSnapshots to fetch.
     */
    orderBy?: MetricsSnapshotOrderByWithRelationInput | MetricsSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetricsSnapshots.
     */
    cursor?: MetricsSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricsSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricsSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetricsSnapshots.
     */
    distinct?: MetricsSnapshotScalarFieldEnum | MetricsSnapshotScalarFieldEnum[]
  }

  /**
   * MetricsSnapshot findMany
   */
  export type MetricsSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which MetricsSnapshots to fetch.
     */
    where?: MetricsSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricsSnapshots to fetch.
     */
    orderBy?: MetricsSnapshotOrderByWithRelationInput | MetricsSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MetricsSnapshots.
     */
    cursor?: MetricsSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricsSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricsSnapshots.
     */
    skip?: number
    distinct?: MetricsSnapshotScalarFieldEnum | MetricsSnapshotScalarFieldEnum[]
  }

  /**
   * MetricsSnapshot create
   */
  export type MetricsSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a MetricsSnapshot.
     */
    data: XOR<MetricsSnapshotCreateInput, MetricsSnapshotUncheckedCreateInput>
  }

  /**
   * MetricsSnapshot createMany
   */
  export type MetricsSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MetricsSnapshots.
     */
    data: MetricsSnapshotCreateManyInput | MetricsSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetricsSnapshot createManyAndReturn
   */
  export type MetricsSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many MetricsSnapshots.
     */
    data: MetricsSnapshotCreateManyInput | MetricsSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetricsSnapshot update
   */
  export type MetricsSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a MetricsSnapshot.
     */
    data: XOR<MetricsSnapshotUpdateInput, MetricsSnapshotUncheckedUpdateInput>
    /**
     * Choose, which MetricsSnapshot to update.
     */
    where: MetricsSnapshotWhereUniqueInput
  }

  /**
   * MetricsSnapshot updateMany
   */
  export type MetricsSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MetricsSnapshots.
     */
    data: XOR<MetricsSnapshotUpdateManyMutationInput, MetricsSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which MetricsSnapshots to update
     */
    where?: MetricsSnapshotWhereInput
    /**
     * Limit how many MetricsSnapshots to update.
     */
    limit?: number
  }

  /**
   * MetricsSnapshot updateManyAndReturn
   */
  export type MetricsSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update MetricsSnapshots.
     */
    data: XOR<MetricsSnapshotUpdateManyMutationInput, MetricsSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which MetricsSnapshots to update
     */
    where?: MetricsSnapshotWhereInput
    /**
     * Limit how many MetricsSnapshots to update.
     */
    limit?: number
  }

  /**
   * MetricsSnapshot upsert
   */
  export type MetricsSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the MetricsSnapshot to update in case it exists.
     */
    where: MetricsSnapshotWhereUniqueInput
    /**
     * In case the MetricsSnapshot found by the `where` argument doesn't exist, create a new MetricsSnapshot with this data.
     */
    create: XOR<MetricsSnapshotCreateInput, MetricsSnapshotUncheckedCreateInput>
    /**
     * In case the MetricsSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetricsSnapshotUpdateInput, MetricsSnapshotUncheckedUpdateInput>
  }

  /**
   * MetricsSnapshot delete
   */
  export type MetricsSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
    /**
     * Filter which MetricsSnapshot to delete.
     */
    where: MetricsSnapshotWhereUniqueInput
  }

  /**
   * MetricsSnapshot deleteMany
   */
  export type MetricsSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetricsSnapshots to delete
     */
    where?: MetricsSnapshotWhereInput
    /**
     * Limit how many MetricsSnapshots to delete.
     */
    limit?: number
  }

  /**
   * MetricsSnapshot without action
   */
  export type MetricsSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricsSnapshot
     */
    select?: MetricsSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricsSnapshot
     */
    omit?: MetricsSnapshotOmit<ExtArgs> | null
  }


  /**
   * Model TemporaryAccess
   */

  export type AggregateTemporaryAccess = {
    _count: TemporaryAccessCountAggregateOutputType | null
    _min: TemporaryAccessMinAggregateOutputType | null
    _max: TemporaryAccessMaxAggregateOutputType | null
  }

  export type TemporaryAccessMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    startTime: Date | null
    endTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemporaryAccessMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    startTime: Date | null
    endTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemporaryAccessCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    startTime: number
    endTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TemporaryAccessMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemporaryAccessMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemporaryAccessCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TemporaryAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemporaryAccess to aggregate.
     */
    where?: TemporaryAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemporaryAccesses to fetch.
     */
    orderBy?: TemporaryAccessOrderByWithRelationInput | TemporaryAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemporaryAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemporaryAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemporaryAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TemporaryAccesses
    **/
    _count?: true | TemporaryAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemporaryAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemporaryAccessMaxAggregateInputType
  }

  export type GetTemporaryAccessAggregateType<T extends TemporaryAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateTemporaryAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemporaryAccess[P]>
      : GetScalarType<T[P], AggregateTemporaryAccess[P]>
  }




  export type TemporaryAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemporaryAccessWhereInput
    orderBy?: TemporaryAccessOrderByWithAggregationInput | TemporaryAccessOrderByWithAggregationInput[]
    by: TemporaryAccessScalarFieldEnum[] | TemporaryAccessScalarFieldEnum
    having?: TemporaryAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemporaryAccessCountAggregateInputType | true
    _min?: TemporaryAccessMinAggregateInputType
    _max?: TemporaryAccessMaxAggregateInputType
  }

  export type TemporaryAccessGroupByOutputType = {
    id: string
    userId: string
    type: string
    startTime: Date
    endTime: Date
    createdAt: Date
    updatedAt: Date
    _count: TemporaryAccessCountAggregateOutputType | null
    _min: TemporaryAccessMinAggregateOutputType | null
    _max: TemporaryAccessMaxAggregateOutputType | null
  }

  type GetTemporaryAccessGroupByPayload<T extends TemporaryAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemporaryAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemporaryAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemporaryAccessGroupByOutputType[P]>
            : GetScalarType<T[P], TemporaryAccessGroupByOutputType[P]>
        }
      >
    >


  export type TemporaryAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporaryAccess"]>

  export type TemporaryAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporaryAccess"]>

  export type TemporaryAccessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporaryAccess"]>

  export type TemporaryAccessSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TemporaryAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "startTime" | "endTime" | "createdAt" | "updatedAt", ExtArgs["result"]["temporaryAccess"]>
  export type TemporaryAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TemporaryAccessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TemporaryAccessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TemporaryAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TemporaryAccess"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      startTime: Date
      endTime: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["temporaryAccess"]>
    composites: {}
  }

  type TemporaryAccessGetPayload<S extends boolean | null | undefined | TemporaryAccessDefaultArgs> = $Result.GetResult<Prisma.$TemporaryAccessPayload, S>

  type TemporaryAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TemporaryAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemporaryAccessCountAggregateInputType | true
    }

  export interface TemporaryAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TemporaryAccess'], meta: { name: 'TemporaryAccess' } }
    /**
     * Find zero or one TemporaryAccess that matches the filter.
     * @param {TemporaryAccessFindUniqueArgs} args - Arguments to find a TemporaryAccess
     * @example
     * // Get one TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemporaryAccessFindUniqueArgs>(args: SelectSubset<T, TemporaryAccessFindUniqueArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TemporaryAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TemporaryAccessFindUniqueOrThrowArgs} args - Arguments to find a TemporaryAccess
     * @example
     * // Get one TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemporaryAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, TemporaryAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TemporaryAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessFindFirstArgs} args - Arguments to find a TemporaryAccess
     * @example
     * // Get one TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemporaryAccessFindFirstArgs>(args?: SelectSubset<T, TemporaryAccessFindFirstArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TemporaryAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessFindFirstOrThrowArgs} args - Arguments to find a TemporaryAccess
     * @example
     * // Get one TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemporaryAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, TemporaryAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TemporaryAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TemporaryAccesses
     * const temporaryAccesses = await prisma.temporaryAccess.findMany()
     * 
     * // Get first 10 TemporaryAccesses
     * const temporaryAccesses = await prisma.temporaryAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const temporaryAccessWithIdOnly = await prisma.temporaryAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemporaryAccessFindManyArgs>(args?: SelectSubset<T, TemporaryAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TemporaryAccess.
     * @param {TemporaryAccessCreateArgs} args - Arguments to create a TemporaryAccess.
     * @example
     * // Create one TemporaryAccess
     * const TemporaryAccess = await prisma.temporaryAccess.create({
     *   data: {
     *     // ... data to create a TemporaryAccess
     *   }
     * })
     * 
     */
    create<T extends TemporaryAccessCreateArgs>(args: SelectSubset<T, TemporaryAccessCreateArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TemporaryAccesses.
     * @param {TemporaryAccessCreateManyArgs} args - Arguments to create many TemporaryAccesses.
     * @example
     * // Create many TemporaryAccesses
     * const temporaryAccess = await prisma.temporaryAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemporaryAccessCreateManyArgs>(args?: SelectSubset<T, TemporaryAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TemporaryAccesses and returns the data saved in the database.
     * @param {TemporaryAccessCreateManyAndReturnArgs} args - Arguments to create many TemporaryAccesses.
     * @example
     * // Create many TemporaryAccesses
     * const temporaryAccess = await prisma.temporaryAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TemporaryAccesses and only return the `id`
     * const temporaryAccessWithIdOnly = await prisma.temporaryAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemporaryAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, TemporaryAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TemporaryAccess.
     * @param {TemporaryAccessDeleteArgs} args - Arguments to delete one TemporaryAccess.
     * @example
     * // Delete one TemporaryAccess
     * const TemporaryAccess = await prisma.temporaryAccess.delete({
     *   where: {
     *     // ... filter to delete one TemporaryAccess
     *   }
     * })
     * 
     */
    delete<T extends TemporaryAccessDeleteArgs>(args: SelectSubset<T, TemporaryAccessDeleteArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TemporaryAccess.
     * @param {TemporaryAccessUpdateArgs} args - Arguments to update one TemporaryAccess.
     * @example
     * // Update one TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemporaryAccessUpdateArgs>(args: SelectSubset<T, TemporaryAccessUpdateArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TemporaryAccesses.
     * @param {TemporaryAccessDeleteManyArgs} args - Arguments to filter TemporaryAccesses to delete.
     * @example
     * // Delete a few TemporaryAccesses
     * const { count } = await prisma.temporaryAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemporaryAccessDeleteManyArgs>(args?: SelectSubset<T, TemporaryAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TemporaryAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TemporaryAccesses
     * const temporaryAccess = await prisma.temporaryAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemporaryAccessUpdateManyArgs>(args: SelectSubset<T, TemporaryAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TemporaryAccesses and returns the data updated in the database.
     * @param {TemporaryAccessUpdateManyAndReturnArgs} args - Arguments to update many TemporaryAccesses.
     * @example
     * // Update many TemporaryAccesses
     * const temporaryAccess = await prisma.temporaryAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TemporaryAccesses and only return the `id`
     * const temporaryAccessWithIdOnly = await prisma.temporaryAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TemporaryAccessUpdateManyAndReturnArgs>(args: SelectSubset<T, TemporaryAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TemporaryAccess.
     * @param {TemporaryAccessUpsertArgs} args - Arguments to update or create a TemporaryAccess.
     * @example
     * // Update or create a TemporaryAccess
     * const temporaryAccess = await prisma.temporaryAccess.upsert({
     *   create: {
     *     // ... data to create a TemporaryAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TemporaryAccess we want to update
     *   }
     * })
     */
    upsert<T extends TemporaryAccessUpsertArgs>(args: SelectSubset<T, TemporaryAccessUpsertArgs<ExtArgs>>): Prisma__TemporaryAccessClient<$Result.GetResult<Prisma.$TemporaryAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TemporaryAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessCountArgs} args - Arguments to filter TemporaryAccesses to count.
     * @example
     * // Count the number of TemporaryAccesses
     * const count = await prisma.temporaryAccess.count({
     *   where: {
     *     // ... the filter for the TemporaryAccesses we want to count
     *   }
     * })
    **/
    count<T extends TemporaryAccessCountArgs>(
      args?: Subset<T, TemporaryAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemporaryAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TemporaryAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemporaryAccessAggregateArgs>(args: Subset<T, TemporaryAccessAggregateArgs>): Prisma.PrismaPromise<GetTemporaryAccessAggregateType<T>>

    /**
     * Group by TemporaryAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemporaryAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemporaryAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemporaryAccessGroupByArgs['orderBy'] }
        : { orderBy?: TemporaryAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemporaryAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemporaryAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TemporaryAccess model
   */
  readonly fields: TemporaryAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TemporaryAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemporaryAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TemporaryAccess model
   */
  interface TemporaryAccessFieldRefs {
    readonly id: FieldRef<"TemporaryAccess", 'String'>
    readonly userId: FieldRef<"TemporaryAccess", 'String'>
    readonly type: FieldRef<"TemporaryAccess", 'String'>
    readonly startTime: FieldRef<"TemporaryAccess", 'DateTime'>
    readonly endTime: FieldRef<"TemporaryAccess", 'DateTime'>
    readonly createdAt: FieldRef<"TemporaryAccess", 'DateTime'>
    readonly updatedAt: FieldRef<"TemporaryAccess", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TemporaryAccess findUnique
   */
  export type TemporaryAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter, which TemporaryAccess to fetch.
     */
    where: TemporaryAccessWhereUniqueInput
  }

  /**
   * TemporaryAccess findUniqueOrThrow
   */
  export type TemporaryAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter, which TemporaryAccess to fetch.
     */
    where: TemporaryAccessWhereUniqueInput
  }

  /**
   * TemporaryAccess findFirst
   */
  export type TemporaryAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter, which TemporaryAccess to fetch.
     */
    where?: TemporaryAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemporaryAccesses to fetch.
     */
    orderBy?: TemporaryAccessOrderByWithRelationInput | TemporaryAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemporaryAccesses.
     */
    cursor?: TemporaryAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemporaryAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemporaryAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemporaryAccesses.
     */
    distinct?: TemporaryAccessScalarFieldEnum | TemporaryAccessScalarFieldEnum[]
  }

  /**
   * TemporaryAccess findFirstOrThrow
   */
  export type TemporaryAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter, which TemporaryAccess to fetch.
     */
    where?: TemporaryAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemporaryAccesses to fetch.
     */
    orderBy?: TemporaryAccessOrderByWithRelationInput | TemporaryAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemporaryAccesses.
     */
    cursor?: TemporaryAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemporaryAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemporaryAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemporaryAccesses.
     */
    distinct?: TemporaryAccessScalarFieldEnum | TemporaryAccessScalarFieldEnum[]
  }

  /**
   * TemporaryAccess findMany
   */
  export type TemporaryAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter, which TemporaryAccesses to fetch.
     */
    where?: TemporaryAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemporaryAccesses to fetch.
     */
    orderBy?: TemporaryAccessOrderByWithRelationInput | TemporaryAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TemporaryAccesses.
     */
    cursor?: TemporaryAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemporaryAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemporaryAccesses.
     */
    skip?: number
    distinct?: TemporaryAccessScalarFieldEnum | TemporaryAccessScalarFieldEnum[]
  }

  /**
   * TemporaryAccess create
   */
  export type TemporaryAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a TemporaryAccess.
     */
    data: XOR<TemporaryAccessCreateInput, TemporaryAccessUncheckedCreateInput>
  }

  /**
   * TemporaryAccess createMany
   */
  export type TemporaryAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TemporaryAccesses.
     */
    data: TemporaryAccessCreateManyInput | TemporaryAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TemporaryAccess createManyAndReturn
   */
  export type TemporaryAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * The data used to create many TemporaryAccesses.
     */
    data: TemporaryAccessCreateManyInput | TemporaryAccessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TemporaryAccess update
   */
  export type TemporaryAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a TemporaryAccess.
     */
    data: XOR<TemporaryAccessUpdateInput, TemporaryAccessUncheckedUpdateInput>
    /**
     * Choose, which TemporaryAccess to update.
     */
    where: TemporaryAccessWhereUniqueInput
  }

  /**
   * TemporaryAccess updateMany
   */
  export type TemporaryAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TemporaryAccesses.
     */
    data: XOR<TemporaryAccessUpdateManyMutationInput, TemporaryAccessUncheckedUpdateManyInput>
    /**
     * Filter which TemporaryAccesses to update
     */
    where?: TemporaryAccessWhereInput
    /**
     * Limit how many TemporaryAccesses to update.
     */
    limit?: number
  }

  /**
   * TemporaryAccess updateManyAndReturn
   */
  export type TemporaryAccessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * The data used to update TemporaryAccesses.
     */
    data: XOR<TemporaryAccessUpdateManyMutationInput, TemporaryAccessUncheckedUpdateManyInput>
    /**
     * Filter which TemporaryAccesses to update
     */
    where?: TemporaryAccessWhereInput
    /**
     * Limit how many TemporaryAccesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TemporaryAccess upsert
   */
  export type TemporaryAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the TemporaryAccess to update in case it exists.
     */
    where: TemporaryAccessWhereUniqueInput
    /**
     * In case the TemporaryAccess found by the `where` argument doesn't exist, create a new TemporaryAccess with this data.
     */
    create: XOR<TemporaryAccessCreateInput, TemporaryAccessUncheckedCreateInput>
    /**
     * In case the TemporaryAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemporaryAccessUpdateInput, TemporaryAccessUncheckedUpdateInput>
  }

  /**
   * TemporaryAccess delete
   */
  export type TemporaryAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
    /**
     * Filter which TemporaryAccess to delete.
     */
    where: TemporaryAccessWhereUniqueInput
  }

  /**
   * TemporaryAccess deleteMany
   */
  export type TemporaryAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemporaryAccesses to delete
     */
    where?: TemporaryAccessWhereInput
    /**
     * Limit how many TemporaryAccesses to delete.
     */
    limit?: number
  }

  /**
   * TemporaryAccess without action
   */
  export type TemporaryAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemporaryAccess
     */
    select?: TemporaryAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TemporaryAccess
     */
    omit?: TemporaryAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemporaryAccessInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CVScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    atsScore: 'atsScore',
    isPublic: 'isPublic',
    publishedAt: 'publishedAt'
  };

  export type CVScalarFieldEnum = (typeof CVScalarFieldEnum)[keyof typeof CVScalarFieldEnum]


  export const CVSectionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    order: 'order',
    cvId: 'cvId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CVSectionScalarFieldEnum = (typeof CVSectionScalarFieldEnum)[keyof typeof CVSectionScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    createdAt: 'createdAt',
    stripePaymentId: 'stripePaymentId'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    canceledAt: 'canceledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    stripeCustomerId: 'stripeCustomerId',
    stripePriceId: 'stripePriceId',
    stripeSubscriptionId: 'stripeSubscriptionId'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    customerId: 'customerId',
    twoFactorSecret: 'twoFactorSecret',
    twoFactorEnabled: 'twoFactorEnabled',
    backupCodes: 'backupCodes',
    marketingConsent: 'marketingConsent',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    failedLoginAttempts: 'failedLoginAttempts',
    lastLogin: 'lastLogin',
    lockedUntil: 'lockedUntil',
    resetToken: 'resetToken',
    resetTokenExpiry: 'resetTokenExpiry'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    token: 'token',
    userId: 'userId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const PageViewScalarFieldEnum: {
    id: 'id',
    url: 'url',
    userId: 'userId',
    timestamp: 'timestamp',
    userAgent: 'userAgent',
    referrer: 'referrer'
  };

  export type PageViewScalarFieldEnum = (typeof PageViewScalarFieldEnum)[keyof typeof PageViewScalarFieldEnum]


  export const ErrorLogScalarFieldEnum: {
    id: 'id',
    name: 'name',
    message: 'message',
    stack: 'stack',
    code: 'code',
    userId: 'userId',
    timestamp: 'timestamp',
    url: 'url',
    method: 'method'
  };

  export type ErrorLogScalarFieldEnum = (typeof ErrorLogScalarFieldEnum)[keyof typeof ErrorLogScalarFieldEnum]


  export const PerformanceMetricScalarFieldEnum: {
    id: 'id',
    type: 'type',
    duration: 'duration',
    details: 'details',
    timestamp: 'timestamp'
  };

  export type PerformanceMetricScalarFieldEnum = (typeof PerformanceMetricScalarFieldEnum)[keyof typeof PerformanceMetricScalarFieldEnum]


  export const MetricsSnapshotScalarFieldEnum: {
    id: 'id',
    activeUsers: 'activeUsers',
    pageViews: 'pageViews',
    errors: 'errors',
    performance: 'performance',
    timestamp: 'timestamp'
  };

  export type MetricsSnapshotScalarFieldEnum = (typeof MetricsSnapshotScalarFieldEnum)[keyof typeof MetricsSnapshotScalarFieldEnum]


  export const TemporaryAccessScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    startTime: 'startTime',
    endTime: 'endTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TemporaryAccessScalarFieldEnum = (typeof TemporaryAccessScalarFieldEnum)[keyof typeof TemporaryAccessScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type CVWhereInput = {
    AND?: CVWhereInput | CVWhereInput[]
    OR?: CVWhereInput[]
    NOT?: CVWhereInput | CVWhereInput[]
    id?: StringFilter<"CV"> | string
    title?: StringFilter<"CV"> | string
    content?: StringFilter<"CV"> | string
    createdAt?: DateTimeFilter<"CV"> | Date | string
    updatedAt?: DateTimeFilter<"CV"> | Date | string
    userId?: StringFilter<"CV"> | string
    atsScore?: IntNullableFilter<"CV"> | number | null
    isPublic?: BoolFilter<"CV"> | boolean
    publishedAt?: DateTimeNullableFilter<"CV"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
    CVSection?: CVSectionListRelationFilter
  }

  export type CVOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    atsScore?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
    CVSection?: CVSectionOrderByRelationAggregateInput
  }

  export type CVWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CVWhereInput | CVWhereInput[]
    OR?: CVWhereInput[]
    NOT?: CVWhereInput | CVWhereInput[]
    title?: StringFilter<"CV"> | string
    content?: StringFilter<"CV"> | string
    createdAt?: DateTimeFilter<"CV"> | Date | string
    updatedAt?: DateTimeFilter<"CV"> | Date | string
    userId?: StringFilter<"CV"> | string
    atsScore?: IntNullableFilter<"CV"> | number | null
    isPublic?: BoolFilter<"CV"> | boolean
    publishedAt?: DateTimeNullableFilter<"CV"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
    CVSection?: CVSectionListRelationFilter
  }, "id">

  export type CVOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    atsScore?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    _count?: CVCountOrderByAggregateInput
    _avg?: CVAvgOrderByAggregateInput
    _max?: CVMaxOrderByAggregateInput
    _min?: CVMinOrderByAggregateInput
    _sum?: CVSumOrderByAggregateInput
  }

  export type CVScalarWhereWithAggregatesInput = {
    AND?: CVScalarWhereWithAggregatesInput | CVScalarWhereWithAggregatesInput[]
    OR?: CVScalarWhereWithAggregatesInput[]
    NOT?: CVScalarWhereWithAggregatesInput | CVScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CV"> | string
    title?: StringWithAggregatesFilter<"CV"> | string
    content?: StringWithAggregatesFilter<"CV"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CV"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CV"> | Date | string
    userId?: StringWithAggregatesFilter<"CV"> | string
    atsScore?: IntNullableWithAggregatesFilter<"CV"> | number | null
    isPublic?: BoolWithAggregatesFilter<"CV"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"CV"> | Date | string | null
  }

  export type CVSectionWhereInput = {
    AND?: CVSectionWhereInput | CVSectionWhereInput[]
    OR?: CVSectionWhereInput[]
    NOT?: CVSectionWhereInput | CVSectionWhereInput[]
    id?: StringFilter<"CVSection"> | string
    title?: StringFilter<"CVSection"> | string
    content?: StringFilter<"CVSection"> | string
    order?: IntFilter<"CVSection"> | number
    cvId?: StringFilter<"CVSection"> | string
    createdAt?: DateTimeFilter<"CVSection"> | Date | string
    updatedAt?: DateTimeFilter<"CVSection"> | Date | string
    CV?: XOR<CVScalarRelationFilter, CVWhereInput>
  }

  export type CVSectionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    cvId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    CV?: CVOrderByWithRelationInput
  }

  export type CVSectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CVSectionWhereInput | CVSectionWhereInput[]
    OR?: CVSectionWhereInput[]
    NOT?: CVSectionWhereInput | CVSectionWhereInput[]
    title?: StringFilter<"CVSection"> | string
    content?: StringFilter<"CVSection"> | string
    order?: IntFilter<"CVSection"> | number
    cvId?: StringFilter<"CVSection"> | string
    createdAt?: DateTimeFilter<"CVSection"> | Date | string
    updatedAt?: DateTimeFilter<"CVSection"> | Date | string
    CV?: XOR<CVScalarRelationFilter, CVWhereInput>
  }, "id">

  export type CVSectionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    cvId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CVSectionCountOrderByAggregateInput
    _avg?: CVSectionAvgOrderByAggregateInput
    _max?: CVSectionMaxOrderByAggregateInput
    _min?: CVSectionMinOrderByAggregateInput
    _sum?: CVSectionSumOrderByAggregateInput
  }

  export type CVSectionScalarWhereWithAggregatesInput = {
    AND?: CVSectionScalarWhereWithAggregatesInput | CVSectionScalarWhereWithAggregatesInput[]
    OR?: CVSectionScalarWhereWithAggregatesInput[]
    NOT?: CVSectionScalarWhereWithAggregatesInput | CVSectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CVSection"> | string
    title?: StringWithAggregatesFilter<"CVSection"> | string
    content?: StringWithAggregatesFilter<"CVSection"> | string
    order?: IntWithAggregatesFilter<"CVSection"> | number
    cvId?: StringWithAggregatesFilter<"CVSection"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CVSection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CVSection"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    userId?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    stripePaymentId?: StringFilter<"Payment"> | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    stripePaymentId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    userId?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    stripePaymentId?: StringFilter<"Payment"> | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    stripePaymentId?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    userId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: FloatWithAggregatesFilter<"Payment"> | number
    currency?: StringWithAggregatesFilter<"Payment"> | string
    status?: StringWithAggregatesFilter<"Payment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    stripePaymentId?: StringWithAggregatesFilter<"Payment"> | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    canceledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    stripeCustomerId?: StringFilter<"Subscription"> | string
    stripePriceId?: StringFilter<"Subscription"> | string
    stripeSubscriptionId?: StringFilter<"Subscription"> | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    canceledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripePriceId?: SortOrder
    stripeSubscriptionId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    userId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    canceledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    stripeCustomerId?: StringFilter<"Subscription"> | string
    stripePriceId?: StringFilter<"Subscription"> | string
    stripeSubscriptionId?: StringFilter<"Subscription"> | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    canceledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripePriceId?: SortOrder
    stripeSubscriptionId?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"Subscription"> | boolean
    canceledAt?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    stripeCustomerId?: StringWithAggregatesFilter<"Subscription"> | string
    stripePriceId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeSubscriptionId?: StringWithAggregatesFilter<"Subscription"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    customerId?: StringNullableFilter<"User"> | string | null
    twoFactorSecret?: StringNullableFilter<"User"> | string | null
    twoFactorEnabled?: BoolFilter<"User"> | boolean
    backupCodes?: StringNullableListFilter<"User">
    marketingConsent?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    failedLoginAttempts?: IntFilter<"User"> | number
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    CV?: CVListRelationFilter
    Payment?: PaymentListRelationFilter
    Subscription?: SubscriptionListRelationFilter
    RefreshTokens?: RefreshTokenListRelationFilter
    PageViews?: PageViewListRelationFilter
    ErrorLogs?: ErrorLogListRelationFilter
    temporaryAccess?: TemporaryAccessListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    customerId?: SortOrderInput | SortOrder
    twoFactorSecret?: SortOrderInput | SortOrder
    twoFactorEnabled?: SortOrder
    backupCodes?: SortOrder
    marketingConsent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    CV?: CVOrderByRelationAggregateInput
    Payment?: PaymentOrderByRelationAggregateInput
    Subscription?: SubscriptionOrderByRelationAggregateInput
    RefreshTokens?: RefreshTokenOrderByRelationAggregateInput
    PageViews?: PageViewOrderByRelationAggregateInput
    ErrorLogs?: ErrorLogOrderByRelationAggregateInput
    temporaryAccess?: TemporaryAccessOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    customerId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    twoFactorSecret?: StringNullableFilter<"User"> | string | null
    twoFactorEnabled?: BoolFilter<"User"> | boolean
    backupCodes?: StringNullableListFilter<"User">
    marketingConsent?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    failedLoginAttempts?: IntFilter<"User"> | number
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    CV?: CVListRelationFilter
    Payment?: PaymentListRelationFilter
    Subscription?: SubscriptionListRelationFilter
    RefreshTokens?: RefreshTokenListRelationFilter
    PageViews?: PageViewListRelationFilter
    ErrorLogs?: ErrorLogListRelationFilter
    temporaryAccess?: TemporaryAccessListRelationFilter
  }, "id" | "email" | "customerId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    customerId?: SortOrderInput | SortOrder
    twoFactorSecret?: SortOrderInput | SortOrder
    twoFactorEnabled?: SortOrder
    backupCodes?: SortOrder
    marketingConsent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    customerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    twoFactorSecret?: StringNullableWithAggregatesFilter<"User"> | string | null
    twoFactorEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    backupCodes?: StringNullableListFilter<"User">
    marketingConsent?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    resetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    token?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: StringWithAggregatesFilter<"RefreshToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type PageViewWhereInput = {
    AND?: PageViewWhereInput | PageViewWhereInput[]
    OR?: PageViewWhereInput[]
    NOT?: PageViewWhereInput | PageViewWhereInput[]
    id?: StringFilter<"PageView"> | string
    url?: StringFilter<"PageView"> | string
    userId?: StringNullableFilter<"PageView"> | string | null
    timestamp?: DateTimeFilter<"PageView"> | Date | string
    userAgent?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PageViewOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    userId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type PageViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PageViewWhereInput | PageViewWhereInput[]
    OR?: PageViewWhereInput[]
    NOT?: PageViewWhereInput | PageViewWhereInput[]
    url?: StringFilter<"PageView"> | string
    userId?: StringNullableFilter<"PageView"> | string | null
    timestamp?: DateTimeFilter<"PageView"> | Date | string
    userAgent?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type PageViewOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    userId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    _count?: PageViewCountOrderByAggregateInput
    _max?: PageViewMaxOrderByAggregateInput
    _min?: PageViewMinOrderByAggregateInput
  }

  export type PageViewScalarWhereWithAggregatesInput = {
    AND?: PageViewScalarWhereWithAggregatesInput | PageViewScalarWhereWithAggregatesInput[]
    OR?: PageViewScalarWhereWithAggregatesInput[]
    NOT?: PageViewScalarWhereWithAggregatesInput | PageViewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PageView"> | string
    url?: StringWithAggregatesFilter<"PageView"> | string
    userId?: StringNullableWithAggregatesFilter<"PageView"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"PageView"> | Date | string
    userAgent?: StringNullableWithAggregatesFilter<"PageView"> | string | null
    referrer?: StringNullableWithAggregatesFilter<"PageView"> | string | null
  }

  export type ErrorLogWhereInput = {
    AND?: ErrorLogWhereInput | ErrorLogWhereInput[]
    OR?: ErrorLogWhereInput[]
    NOT?: ErrorLogWhereInput | ErrorLogWhereInput[]
    id?: StringFilter<"ErrorLog"> | string
    name?: StringFilter<"ErrorLog"> | string
    message?: StringFilter<"ErrorLog"> | string
    stack?: StringNullableFilter<"ErrorLog"> | string | null
    code?: StringNullableFilter<"ErrorLog"> | string | null
    userId?: StringNullableFilter<"ErrorLog"> | string | null
    timestamp?: DateTimeFilter<"ErrorLog"> | Date | string
    url?: StringNullableFilter<"ErrorLog"> | string | null
    method?: StringNullableFilter<"ErrorLog"> | string | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ErrorLogOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    message?: SortOrder
    stack?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    url?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type ErrorLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ErrorLogWhereInput | ErrorLogWhereInput[]
    OR?: ErrorLogWhereInput[]
    NOT?: ErrorLogWhereInput | ErrorLogWhereInput[]
    name?: StringFilter<"ErrorLog"> | string
    message?: StringFilter<"ErrorLog"> | string
    stack?: StringNullableFilter<"ErrorLog"> | string | null
    code?: StringNullableFilter<"ErrorLog"> | string | null
    userId?: StringNullableFilter<"ErrorLog"> | string | null
    timestamp?: DateTimeFilter<"ErrorLog"> | Date | string
    url?: StringNullableFilter<"ErrorLog"> | string | null
    method?: StringNullableFilter<"ErrorLog"> | string | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ErrorLogOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    message?: SortOrder
    stack?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    url?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    _count?: ErrorLogCountOrderByAggregateInput
    _max?: ErrorLogMaxOrderByAggregateInput
    _min?: ErrorLogMinOrderByAggregateInput
  }

  export type ErrorLogScalarWhereWithAggregatesInput = {
    AND?: ErrorLogScalarWhereWithAggregatesInput | ErrorLogScalarWhereWithAggregatesInput[]
    OR?: ErrorLogScalarWhereWithAggregatesInput[]
    NOT?: ErrorLogScalarWhereWithAggregatesInput | ErrorLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ErrorLog"> | string
    name?: StringWithAggregatesFilter<"ErrorLog"> | string
    message?: StringWithAggregatesFilter<"ErrorLog"> | string
    stack?: StringNullableWithAggregatesFilter<"ErrorLog"> | string | null
    code?: StringNullableWithAggregatesFilter<"ErrorLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"ErrorLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"ErrorLog"> | Date | string
    url?: StringNullableWithAggregatesFilter<"ErrorLog"> | string | null
    method?: StringNullableWithAggregatesFilter<"ErrorLog"> | string | null
  }

  export type PerformanceMetricWhereInput = {
    AND?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[]
    OR?: PerformanceMetricWhereInput[]
    NOT?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[]
    id?: StringFilter<"PerformanceMetric"> | string
    type?: StringFilter<"PerformanceMetric"> | string
    duration?: FloatFilter<"PerformanceMetric"> | number
    details?: JsonNullableFilter<"PerformanceMetric">
    timestamp?: DateTimeFilter<"PerformanceMetric"> | Date | string
  }

  export type PerformanceMetricOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    duration?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type PerformanceMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[]
    OR?: PerformanceMetricWhereInput[]
    NOT?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[]
    type?: StringFilter<"PerformanceMetric"> | string
    duration?: FloatFilter<"PerformanceMetric"> | number
    details?: JsonNullableFilter<"PerformanceMetric">
    timestamp?: DateTimeFilter<"PerformanceMetric"> | Date | string
  }, "id">

  export type PerformanceMetricOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    duration?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: PerformanceMetricCountOrderByAggregateInput
    _avg?: PerformanceMetricAvgOrderByAggregateInput
    _max?: PerformanceMetricMaxOrderByAggregateInput
    _min?: PerformanceMetricMinOrderByAggregateInput
    _sum?: PerformanceMetricSumOrderByAggregateInput
  }

  export type PerformanceMetricScalarWhereWithAggregatesInput = {
    AND?: PerformanceMetricScalarWhereWithAggregatesInput | PerformanceMetricScalarWhereWithAggregatesInput[]
    OR?: PerformanceMetricScalarWhereWithAggregatesInput[]
    NOT?: PerformanceMetricScalarWhereWithAggregatesInput | PerformanceMetricScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PerformanceMetric"> | string
    type?: StringWithAggregatesFilter<"PerformanceMetric"> | string
    duration?: FloatWithAggregatesFilter<"PerformanceMetric"> | number
    details?: JsonNullableWithAggregatesFilter<"PerformanceMetric">
    timestamp?: DateTimeWithAggregatesFilter<"PerformanceMetric"> | Date | string
  }

  export type MetricsSnapshotWhereInput = {
    AND?: MetricsSnapshotWhereInput | MetricsSnapshotWhereInput[]
    OR?: MetricsSnapshotWhereInput[]
    NOT?: MetricsSnapshotWhereInput | MetricsSnapshotWhereInput[]
    id?: StringFilter<"MetricsSnapshot"> | string
    activeUsers?: IntFilter<"MetricsSnapshot"> | number
    pageViews?: JsonFilter<"MetricsSnapshot">
    errors?: JsonFilter<"MetricsSnapshot">
    performance?: JsonFilter<"MetricsSnapshot">
    timestamp?: DateTimeFilter<"MetricsSnapshot"> | Date | string
  }

  export type MetricsSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    activeUsers?: SortOrder
    pageViews?: SortOrder
    errors?: SortOrder
    performance?: SortOrder
    timestamp?: SortOrder
  }

  export type MetricsSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MetricsSnapshotWhereInput | MetricsSnapshotWhereInput[]
    OR?: MetricsSnapshotWhereInput[]
    NOT?: MetricsSnapshotWhereInput | MetricsSnapshotWhereInput[]
    activeUsers?: IntFilter<"MetricsSnapshot"> | number
    pageViews?: JsonFilter<"MetricsSnapshot">
    errors?: JsonFilter<"MetricsSnapshot">
    performance?: JsonFilter<"MetricsSnapshot">
    timestamp?: DateTimeFilter<"MetricsSnapshot"> | Date | string
  }, "id">

  export type MetricsSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    activeUsers?: SortOrder
    pageViews?: SortOrder
    errors?: SortOrder
    performance?: SortOrder
    timestamp?: SortOrder
    _count?: MetricsSnapshotCountOrderByAggregateInput
    _avg?: MetricsSnapshotAvgOrderByAggregateInput
    _max?: MetricsSnapshotMaxOrderByAggregateInput
    _min?: MetricsSnapshotMinOrderByAggregateInput
    _sum?: MetricsSnapshotSumOrderByAggregateInput
  }

  export type MetricsSnapshotScalarWhereWithAggregatesInput = {
    AND?: MetricsSnapshotScalarWhereWithAggregatesInput | MetricsSnapshotScalarWhereWithAggregatesInput[]
    OR?: MetricsSnapshotScalarWhereWithAggregatesInput[]
    NOT?: MetricsSnapshotScalarWhereWithAggregatesInput | MetricsSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MetricsSnapshot"> | string
    activeUsers?: IntWithAggregatesFilter<"MetricsSnapshot"> | number
    pageViews?: JsonWithAggregatesFilter<"MetricsSnapshot">
    errors?: JsonWithAggregatesFilter<"MetricsSnapshot">
    performance?: JsonWithAggregatesFilter<"MetricsSnapshot">
    timestamp?: DateTimeWithAggregatesFilter<"MetricsSnapshot"> | Date | string
  }

  export type TemporaryAccessWhereInput = {
    AND?: TemporaryAccessWhereInput | TemporaryAccessWhereInput[]
    OR?: TemporaryAccessWhereInput[]
    NOT?: TemporaryAccessWhereInput | TemporaryAccessWhereInput[]
    id?: StringFilter<"TemporaryAccess"> | string
    userId?: StringFilter<"TemporaryAccess"> | string
    type?: StringFilter<"TemporaryAccess"> | string
    startTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    endTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    createdAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
    updatedAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TemporaryAccessOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TemporaryAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TemporaryAccessWhereInput | TemporaryAccessWhereInput[]
    OR?: TemporaryAccessWhereInput[]
    NOT?: TemporaryAccessWhereInput | TemporaryAccessWhereInput[]
    userId?: StringFilter<"TemporaryAccess"> | string
    type?: StringFilter<"TemporaryAccess"> | string
    startTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    endTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    createdAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
    updatedAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TemporaryAccessOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TemporaryAccessCountOrderByAggregateInput
    _max?: TemporaryAccessMaxOrderByAggregateInput
    _min?: TemporaryAccessMinOrderByAggregateInput
  }

  export type TemporaryAccessScalarWhereWithAggregatesInput = {
    AND?: TemporaryAccessScalarWhereWithAggregatesInput | TemporaryAccessScalarWhereWithAggregatesInput[]
    OR?: TemporaryAccessScalarWhereWithAggregatesInput[]
    NOT?: TemporaryAccessScalarWhereWithAggregatesInput | TemporaryAccessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TemporaryAccess"> | string
    userId?: StringWithAggregatesFilter<"TemporaryAccess"> | string
    type?: StringWithAggregatesFilter<"TemporaryAccess"> | string
    startTime?: DateTimeWithAggregatesFilter<"TemporaryAccess"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"TemporaryAccess"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"TemporaryAccess"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TemporaryAccess"> | Date | string
  }

  export type CVCreateInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
    User: UserCreateNestedOneWithoutCVInput
    CVSection?: CVSectionCreateNestedManyWithoutCVInput
  }

  export type CVUncheckedCreateInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    userId: string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
    CVSection?: CVSectionUncheckedCreateNestedManyWithoutCVInput
  }

  export type CVUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    User?: UserUpdateOneRequiredWithoutCVNestedInput
    CVSection?: CVSectionUpdateManyWithoutCVNestedInput
  }

  export type CVUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CVSection?: CVSectionUncheckedUpdateManyWithoutCVNestedInput
  }

  export type CVCreateManyInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    userId: string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
  }

  export type CVUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CVUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CVSectionCreateInput = {
    id: string
    title: string
    content: string
    order: number
    createdAt?: Date | string
    updatedAt: Date | string
    CV: CVCreateNestedOneWithoutCVSectionInput
  }

  export type CVSectionUncheckedCreateInput = {
    id: string
    title: string
    content: string
    order: number
    cvId: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type CVSectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CV?: CVUpdateOneRequiredWithoutCVSectionNestedInput
  }

  export type CVSectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    cvId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CVSectionCreateManyInput = {
    id: string
    title: string
    content: string
    order: number
    cvId: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type CVSectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CVSectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    cvId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
    User: UserCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id: string
    userId: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    User?: UserUpdateOneRequiredWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateManyInput = {
    id: string
    userId: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionCreateInput = {
    id: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
    User: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id: string
    userId: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    User?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionCreateManyInput = {
    id: string
    userId: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    User: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    token: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    User?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    token: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewCreateInput = {
    id?: string
    url: string
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
    User?: UserCreateNestedOneWithoutPageViewsInput
  }

  export type PageViewUncheckedCreateInput = {
    id?: string
    url: string
    userId?: string | null
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
  }

  export type PageViewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    User?: UserUpdateOneWithoutPageViewsNestedInput
  }

  export type PageViewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PageViewCreateManyInput = {
    id?: string
    url: string
    userId?: string | null
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
  }

  export type PageViewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PageViewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogCreateInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
    User?: UserCreateNestedOneWithoutErrorLogsInput
  }

  export type ErrorLogUncheckedCreateInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    userId?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
  }

  export type ErrorLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    User?: UserUpdateOneWithoutErrorLogsNestedInput
  }

  export type ErrorLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogCreateManyInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    userId?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
  }

  export type ErrorLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PerformanceMetricCreateInput = {
    id?: string
    type: string
    duration: number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type PerformanceMetricUncheckedCreateInput = {
    id?: string
    type: string
    duration: number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type PerformanceMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    duration?: FloatFieldUpdateOperationsInput | number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    duration?: FloatFieldUpdateOperationsInput | number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceMetricCreateManyInput = {
    id?: string
    type: string
    duration: number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type PerformanceMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    duration?: FloatFieldUpdateOperationsInput | number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    duration?: FloatFieldUpdateOperationsInput | number
    details?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricsSnapshotCreateInput = {
    id?: string
    activeUsers: number
    pageViews: JsonNullValueInput | InputJsonValue
    errors: JsonNullValueInput | InputJsonValue
    performance: JsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type MetricsSnapshotUncheckedCreateInput = {
    id?: string
    activeUsers: number
    pageViews: JsonNullValueInput | InputJsonValue
    errors: JsonNullValueInput | InputJsonValue
    performance: JsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type MetricsSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    activeUsers?: IntFieldUpdateOperationsInput | number
    pageViews?: JsonNullValueInput | InputJsonValue
    errors?: JsonNullValueInput | InputJsonValue
    performance?: JsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricsSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    activeUsers?: IntFieldUpdateOperationsInput | number
    pageViews?: JsonNullValueInput | InputJsonValue
    errors?: JsonNullValueInput | InputJsonValue
    performance?: JsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricsSnapshotCreateManyInput = {
    id?: string
    activeUsers: number
    pageViews: JsonNullValueInput | InputJsonValue
    errors: JsonNullValueInput | InputJsonValue
    performance: JsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type MetricsSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    activeUsers?: IntFieldUpdateOperationsInput | number
    pageViews?: JsonNullValueInput | InputJsonValue
    errors?: JsonNullValueInput | InputJsonValue
    performance?: JsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricsSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    activeUsers?: IntFieldUpdateOperationsInput | number
    pageViews?: JsonNullValueInput | InputJsonValue
    errors?: JsonNullValueInput | InputJsonValue
    performance?: JsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemporaryAccessCreateInput = {
    id?: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTemporaryAccessInput
  }

  export type TemporaryAccessUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemporaryAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTemporaryAccessNestedInput
  }

  export type TemporaryAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemporaryAccessCreateManyInput = {
    id?: string
    userId: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemporaryAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemporaryAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CVSectionListRelationFilter = {
    every?: CVSectionWhereInput
    some?: CVSectionWhereInput
    none?: CVSectionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CVSectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CVCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    atsScore?: SortOrder
    isPublic?: SortOrder
    publishedAt?: SortOrder
  }

  export type CVAvgOrderByAggregateInput = {
    atsScore?: SortOrder
  }

  export type CVMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    atsScore?: SortOrder
    isPublic?: SortOrder
    publishedAt?: SortOrder
  }

  export type CVMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    atsScore?: SortOrder
    isPublic?: SortOrder
    publishedAt?: SortOrder
  }

  export type CVSumOrderByAggregateInput = {
    atsScore?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CVScalarRelationFilter = {
    is?: CVWhereInput
    isNot?: CVWhereInput
  }

  export type CVSectionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    cvId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CVSectionAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type CVSectionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    cvId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CVSectionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    cvId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CVSectionSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    stripePaymentId?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    stripePaymentId?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    stripePaymentId?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripePriceId?: SortOrder
    stripeSubscriptionId?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripePriceId?: SortOrder
    stripeSubscriptionId?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripePriceId?: SortOrder
    stripeSubscriptionId?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CVListRelationFilter = {
    every?: CVWhereInput
    some?: CVWhereInput
    none?: CVWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type PageViewListRelationFilter = {
    every?: PageViewWhereInput
    some?: PageViewWhereInput
    none?: PageViewWhereInput
  }

  export type ErrorLogListRelationFilter = {
    every?: ErrorLogWhereInput
    some?: ErrorLogWhereInput
    none?: ErrorLogWhereInput
  }

  export type TemporaryAccessListRelationFilter = {
    every?: TemporaryAccessWhereInput
    some?: TemporaryAccessWhereInput
    none?: TemporaryAccessWhereInput
  }

  export type CVOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PageViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ErrorLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TemporaryAccessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    customerId?: SortOrder
    twoFactorSecret?: SortOrder
    twoFactorEnabled?: SortOrder
    backupCodes?: SortOrder
    marketingConsent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lastLogin?: SortOrder
    lockedUntil?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    customerId?: SortOrder
    twoFactorSecret?: SortOrder
    twoFactorEnabled?: SortOrder
    marketingConsent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lastLogin?: SortOrder
    lockedUntil?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    customerId?: SortOrder
    twoFactorSecret?: SortOrder
    twoFactorEnabled?: SortOrder
    marketingConsent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lastLogin?: SortOrder
    lockedUntil?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PageViewCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    userAgent?: SortOrder
    referrer?: SortOrder
  }

  export type PageViewMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    userAgent?: SortOrder
    referrer?: SortOrder
  }

  export type PageViewMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    userAgent?: SortOrder
    referrer?: SortOrder
  }

  export type ErrorLogCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    code?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    method?: SortOrder
  }

  export type ErrorLogMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    code?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    method?: SortOrder
  }

  export type ErrorLogMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    code?: SortOrder
    userId?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    method?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PerformanceMetricCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    duration?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
  }

  export type PerformanceMetricAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type PerformanceMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    duration?: SortOrder
    timestamp?: SortOrder
  }

  export type PerformanceMetricMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    duration?: SortOrder
    timestamp?: SortOrder
  }

  export type PerformanceMetricSumOrderByAggregateInput = {
    duration?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MetricsSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    activeUsers?: SortOrder
    pageViews?: SortOrder
    errors?: SortOrder
    performance?: SortOrder
    timestamp?: SortOrder
  }

  export type MetricsSnapshotAvgOrderByAggregateInput = {
    activeUsers?: SortOrder
  }

  export type MetricsSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    activeUsers?: SortOrder
    timestamp?: SortOrder
  }

  export type MetricsSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    activeUsers?: SortOrder
    timestamp?: SortOrder
  }

  export type MetricsSnapshotSumOrderByAggregateInput = {
    activeUsers?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type TemporaryAccessCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemporaryAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemporaryAccessMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCreateNestedOneWithoutCVInput = {
    create?: XOR<UserCreateWithoutCVInput, UserUncheckedCreateWithoutCVInput>
    connectOrCreate?: UserCreateOrConnectWithoutCVInput
    connect?: UserWhereUniqueInput
  }

  export type CVSectionCreateNestedManyWithoutCVInput = {
    create?: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput> | CVSectionCreateWithoutCVInput[] | CVSectionUncheckedCreateWithoutCVInput[]
    connectOrCreate?: CVSectionCreateOrConnectWithoutCVInput | CVSectionCreateOrConnectWithoutCVInput[]
    createMany?: CVSectionCreateManyCVInputEnvelope
    connect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
  }

  export type CVSectionUncheckedCreateNestedManyWithoutCVInput = {
    create?: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput> | CVSectionCreateWithoutCVInput[] | CVSectionUncheckedCreateWithoutCVInput[]
    connectOrCreate?: CVSectionCreateOrConnectWithoutCVInput | CVSectionCreateOrConnectWithoutCVInput[]
    createMany?: CVSectionCreateManyCVInputEnvelope
    connect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutCVNestedInput = {
    create?: XOR<UserCreateWithoutCVInput, UserUncheckedCreateWithoutCVInput>
    connectOrCreate?: UserCreateOrConnectWithoutCVInput
    upsert?: UserUpsertWithoutCVInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCVInput, UserUpdateWithoutCVInput>, UserUncheckedUpdateWithoutCVInput>
  }

  export type CVSectionUpdateManyWithoutCVNestedInput = {
    create?: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput> | CVSectionCreateWithoutCVInput[] | CVSectionUncheckedCreateWithoutCVInput[]
    connectOrCreate?: CVSectionCreateOrConnectWithoutCVInput | CVSectionCreateOrConnectWithoutCVInput[]
    upsert?: CVSectionUpsertWithWhereUniqueWithoutCVInput | CVSectionUpsertWithWhereUniqueWithoutCVInput[]
    createMany?: CVSectionCreateManyCVInputEnvelope
    set?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    disconnect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    delete?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    connect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    update?: CVSectionUpdateWithWhereUniqueWithoutCVInput | CVSectionUpdateWithWhereUniqueWithoutCVInput[]
    updateMany?: CVSectionUpdateManyWithWhereWithoutCVInput | CVSectionUpdateManyWithWhereWithoutCVInput[]
    deleteMany?: CVSectionScalarWhereInput | CVSectionScalarWhereInput[]
  }

  export type CVSectionUncheckedUpdateManyWithoutCVNestedInput = {
    create?: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput> | CVSectionCreateWithoutCVInput[] | CVSectionUncheckedCreateWithoutCVInput[]
    connectOrCreate?: CVSectionCreateOrConnectWithoutCVInput | CVSectionCreateOrConnectWithoutCVInput[]
    upsert?: CVSectionUpsertWithWhereUniqueWithoutCVInput | CVSectionUpsertWithWhereUniqueWithoutCVInput[]
    createMany?: CVSectionCreateManyCVInputEnvelope
    set?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    disconnect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    delete?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    connect?: CVSectionWhereUniqueInput | CVSectionWhereUniqueInput[]
    update?: CVSectionUpdateWithWhereUniqueWithoutCVInput | CVSectionUpdateWithWhereUniqueWithoutCVInput[]
    updateMany?: CVSectionUpdateManyWithWhereWithoutCVInput | CVSectionUpdateManyWithWhereWithoutCVInput[]
    deleteMany?: CVSectionScalarWhereInput | CVSectionScalarWhereInput[]
  }

  export type CVCreateNestedOneWithoutCVSectionInput = {
    create?: XOR<CVCreateWithoutCVSectionInput, CVUncheckedCreateWithoutCVSectionInput>
    connectOrCreate?: CVCreateOrConnectWithoutCVSectionInput
    connect?: CVWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CVUpdateOneRequiredWithoutCVSectionNestedInput = {
    create?: XOR<CVCreateWithoutCVSectionInput, CVUncheckedCreateWithoutCVSectionInput>
    connectOrCreate?: CVCreateOrConnectWithoutCVSectionInput
    upsert?: CVUpsertWithoutCVSectionInput
    connect?: CVWhereUniqueInput
    update?: XOR<XOR<CVUpdateToOneWithWhereWithoutCVSectionInput, CVUpdateWithoutCVSectionInput>, CVUncheckedUpdateWithoutCVSectionInput>
  }

  export type UserCreateNestedOneWithoutPaymentInput = {
    create?: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentInput
    upsert?: UserUpsertWithoutPaymentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentInput, UserUpdateWithoutPaymentInput>, UserUncheckedUpdateWithoutPaymentInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserCreatebackupCodesInput = {
    set: string[]
  }

  export type CVCreateNestedManyWithoutUserInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type PageViewCreateNestedManyWithoutUserInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ErrorLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput> | ErrorLogCreateWithoutUserInput[] | ErrorLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ErrorLogCreateOrConnectWithoutUserInput | ErrorLogCreateOrConnectWithoutUserInput[]
    createMany?: ErrorLogCreateManyUserInputEnvelope
    connect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
  }

  export type TemporaryAccessCreateNestedManyWithoutUserInput = {
    create?: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput> | TemporaryAccessCreateWithoutUserInput[] | TemporaryAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TemporaryAccessCreateOrConnectWithoutUserInput | TemporaryAccessCreateOrConnectWithoutUserInput[]
    createMany?: TemporaryAccessCreateManyUserInputEnvelope
    connect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
  }

  export type CVUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type PageViewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ErrorLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput> | ErrorLogCreateWithoutUserInput[] | ErrorLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ErrorLogCreateOrConnectWithoutUserInput | ErrorLogCreateOrConnectWithoutUserInput[]
    createMany?: ErrorLogCreateManyUserInputEnvelope
    connect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
  }

  export type TemporaryAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput> | TemporaryAccessCreateWithoutUserInput[] | TemporaryAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TemporaryAccessCreateOrConnectWithoutUserInput | TemporaryAccessCreateOrConnectWithoutUserInput[]
    createMany?: TemporaryAccessCreateManyUserInputEnvelope
    connect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdatebackupCodesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CVUpdateManyWithoutUserNestedInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    upsert?: CVUpsertWithWhereUniqueWithoutUserInput | CVUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    set?: CVWhereUniqueInput | CVWhereUniqueInput[]
    disconnect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    delete?: CVWhereUniqueInput | CVWhereUniqueInput[]
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    update?: CVUpdateWithWhereUniqueWithoutUserInput | CVUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CVUpdateManyWithWhereWithoutUserInput | CVUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CVScalarWhereInput | CVScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type PageViewUpdateManyWithoutUserNestedInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutUserInput | PageViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutUserInput | PageViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutUserInput | PageViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ErrorLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput> | ErrorLogCreateWithoutUserInput[] | ErrorLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ErrorLogCreateOrConnectWithoutUserInput | ErrorLogCreateOrConnectWithoutUserInput[]
    upsert?: ErrorLogUpsertWithWhereUniqueWithoutUserInput | ErrorLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ErrorLogCreateManyUserInputEnvelope
    set?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    disconnect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    delete?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    connect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    update?: ErrorLogUpdateWithWhereUniqueWithoutUserInput | ErrorLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ErrorLogUpdateManyWithWhereWithoutUserInput | ErrorLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ErrorLogScalarWhereInput | ErrorLogScalarWhereInput[]
  }

  export type TemporaryAccessUpdateManyWithoutUserNestedInput = {
    create?: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput> | TemporaryAccessCreateWithoutUserInput[] | TemporaryAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TemporaryAccessCreateOrConnectWithoutUserInput | TemporaryAccessCreateOrConnectWithoutUserInput[]
    upsert?: TemporaryAccessUpsertWithWhereUniqueWithoutUserInput | TemporaryAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TemporaryAccessCreateManyUserInputEnvelope
    set?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    disconnect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    delete?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    connect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    update?: TemporaryAccessUpdateWithWhereUniqueWithoutUserInput | TemporaryAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TemporaryAccessUpdateManyWithWhereWithoutUserInput | TemporaryAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TemporaryAccessScalarWhereInput | TemporaryAccessScalarWhereInput[]
  }

  export type CVUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    upsert?: CVUpsertWithWhereUniqueWithoutUserInput | CVUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    set?: CVWhereUniqueInput | CVWhereUniqueInput[]
    disconnect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    delete?: CVWhereUniqueInput | CVWhereUniqueInput[]
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    update?: CVUpdateWithWhereUniqueWithoutUserInput | CVUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CVUpdateManyWithWhereWithoutUserInput | CVUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CVScalarWhereInput | CVScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type PageViewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutUserInput | PageViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutUserInput | PageViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutUserInput | PageViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ErrorLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput> | ErrorLogCreateWithoutUserInput[] | ErrorLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ErrorLogCreateOrConnectWithoutUserInput | ErrorLogCreateOrConnectWithoutUserInput[]
    upsert?: ErrorLogUpsertWithWhereUniqueWithoutUserInput | ErrorLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ErrorLogCreateManyUserInputEnvelope
    set?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    disconnect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    delete?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    connect?: ErrorLogWhereUniqueInput | ErrorLogWhereUniqueInput[]
    update?: ErrorLogUpdateWithWhereUniqueWithoutUserInput | ErrorLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ErrorLogUpdateManyWithWhereWithoutUserInput | ErrorLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ErrorLogScalarWhereInput | ErrorLogScalarWhereInput[]
  }

  export type TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput> | TemporaryAccessCreateWithoutUserInput[] | TemporaryAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TemporaryAccessCreateOrConnectWithoutUserInput | TemporaryAccessCreateOrConnectWithoutUserInput[]
    upsert?: TemporaryAccessUpsertWithWhereUniqueWithoutUserInput | TemporaryAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TemporaryAccessCreateManyUserInputEnvelope
    set?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    disconnect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    delete?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    connect?: TemporaryAccessWhereUniqueInput | TemporaryAccessWhereUniqueInput[]
    update?: TemporaryAccessUpdateWithWhereUniqueWithoutUserInput | TemporaryAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TemporaryAccessUpdateManyWithWhereWithoutUserInput | TemporaryAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TemporaryAccessScalarWhereInput | TemporaryAccessScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserCreateNestedOneWithoutPageViewsInput = {
    create?: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPageViewsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutPageViewsNestedInput = {
    create?: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPageViewsInput
    upsert?: UserUpsertWithoutPageViewsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPageViewsInput, UserUpdateWithoutPageViewsInput>, UserUncheckedUpdateWithoutPageViewsInput>
  }

  export type UserCreateNestedOneWithoutErrorLogsInput = {
    create?: XOR<UserCreateWithoutErrorLogsInput, UserUncheckedCreateWithoutErrorLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutErrorLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutErrorLogsNestedInput = {
    create?: XOR<UserCreateWithoutErrorLogsInput, UserUncheckedCreateWithoutErrorLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutErrorLogsInput
    upsert?: UserUpsertWithoutErrorLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutErrorLogsInput, UserUpdateWithoutErrorLogsInput>, UserUncheckedUpdateWithoutErrorLogsInput>
  }

  export type UserCreateNestedOneWithoutTemporaryAccessInput = {
    create?: XOR<UserCreateWithoutTemporaryAccessInput, UserUncheckedCreateWithoutTemporaryAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutTemporaryAccessInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTemporaryAccessNestedInput = {
    create?: XOR<UserCreateWithoutTemporaryAccessInput, UserUncheckedCreateWithoutTemporaryAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutTemporaryAccessInput
    upsert?: UserUpsertWithoutTemporaryAccessInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTemporaryAccessInput, UserUpdateWithoutTemporaryAccessInput>, UserUncheckedUpdateWithoutTemporaryAccessInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutCVInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCVInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCVInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCVInput, UserUncheckedCreateWithoutCVInput>
  }

  export type CVSectionCreateWithoutCVInput = {
    id: string
    title: string
    content: string
    order: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type CVSectionUncheckedCreateWithoutCVInput = {
    id: string
    title: string
    content: string
    order: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type CVSectionCreateOrConnectWithoutCVInput = {
    where: CVSectionWhereUniqueInput
    create: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput>
  }

  export type CVSectionCreateManyCVInputEnvelope = {
    data: CVSectionCreateManyCVInput | CVSectionCreateManyCVInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCVInput = {
    update: XOR<UserUpdateWithoutCVInput, UserUncheckedUpdateWithoutCVInput>
    create: XOR<UserCreateWithoutCVInput, UserUncheckedCreateWithoutCVInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCVInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCVInput, UserUncheckedUpdateWithoutCVInput>
  }

  export type UserUpdateWithoutCVInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCVInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CVSectionUpsertWithWhereUniqueWithoutCVInput = {
    where: CVSectionWhereUniqueInput
    update: XOR<CVSectionUpdateWithoutCVInput, CVSectionUncheckedUpdateWithoutCVInput>
    create: XOR<CVSectionCreateWithoutCVInput, CVSectionUncheckedCreateWithoutCVInput>
  }

  export type CVSectionUpdateWithWhereUniqueWithoutCVInput = {
    where: CVSectionWhereUniqueInput
    data: XOR<CVSectionUpdateWithoutCVInput, CVSectionUncheckedUpdateWithoutCVInput>
  }

  export type CVSectionUpdateManyWithWhereWithoutCVInput = {
    where: CVSectionScalarWhereInput
    data: XOR<CVSectionUpdateManyMutationInput, CVSectionUncheckedUpdateManyWithoutCVInput>
  }

  export type CVSectionScalarWhereInput = {
    AND?: CVSectionScalarWhereInput | CVSectionScalarWhereInput[]
    OR?: CVSectionScalarWhereInput[]
    NOT?: CVSectionScalarWhereInput | CVSectionScalarWhereInput[]
    id?: StringFilter<"CVSection"> | string
    title?: StringFilter<"CVSection"> | string
    content?: StringFilter<"CVSection"> | string
    order?: IntFilter<"CVSection"> | number
    cvId?: StringFilter<"CVSection"> | string
    createdAt?: DateTimeFilter<"CVSection"> | Date | string
    updatedAt?: DateTimeFilter<"CVSection"> | Date | string
  }

  export type CVCreateWithoutCVSectionInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
    User: UserCreateNestedOneWithoutCVInput
  }

  export type CVUncheckedCreateWithoutCVSectionInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    userId: string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
  }

  export type CVCreateOrConnectWithoutCVSectionInput = {
    where: CVWhereUniqueInput
    create: XOR<CVCreateWithoutCVSectionInput, CVUncheckedCreateWithoutCVSectionInput>
  }

  export type CVUpsertWithoutCVSectionInput = {
    update: XOR<CVUpdateWithoutCVSectionInput, CVUncheckedUpdateWithoutCVSectionInput>
    create: XOR<CVCreateWithoutCVSectionInput, CVUncheckedCreateWithoutCVSectionInput>
    where?: CVWhereInput
  }

  export type CVUpdateToOneWithWhereWithoutCVSectionInput = {
    where?: CVWhereInput
    data: XOR<CVUpdateWithoutCVSectionInput, CVUncheckedUpdateWithoutCVSectionInput>
  }

  export type CVUpdateWithoutCVSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    User?: UserUpdateOneRequiredWithoutCVNestedInput
  }

  export type CVUncheckedUpdateWithoutCVSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateWithoutPaymentInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
  }

  export type UserUpsertWithoutPaymentInput = {
    update: XOR<UserUpdateWithoutPaymentInput, UserUncheckedUpdateWithoutPaymentInput>
    create: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentInput, UserUncheckedUpdateWithoutPaymentInput>
  }

  export type UserUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSubscriptionInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CVCreateWithoutUserInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
    CVSection?: CVSectionCreateNestedManyWithoutCVInput
  }

  export type CVUncheckedCreateWithoutUserInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
    CVSection?: CVSectionUncheckedCreateNestedManyWithoutCVInput
  }

  export type CVCreateOrConnectWithoutUserInput = {
    where: CVWhereUniqueInput
    create: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput>
  }

  export type CVCreateManyUserInputEnvelope = {
    data: CVCreateManyUserInput | CVCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutUserInput = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
  }

  export type PaymentUncheckedCreateWithoutUserInput = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
  }

  export type PaymentCreateOrConnectWithoutUserInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateManyUserInputEnvelope = {
    data: PaymentCreateManyUserInput | PaymentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: SubscriptionCreateManyUserInput | SubscriptionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PageViewCreateWithoutUserInput = {
    id?: string
    url: string
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
  }

  export type PageViewUncheckedCreateWithoutUserInput = {
    id?: string
    url: string
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
  }

  export type PageViewCreateOrConnectWithoutUserInput = {
    where: PageViewWhereUniqueInput
    create: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput>
  }

  export type PageViewCreateManyUserInputEnvelope = {
    data: PageViewCreateManyUserInput | PageViewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ErrorLogCreateWithoutUserInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
  }

  export type ErrorLogUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
  }

  export type ErrorLogCreateOrConnectWithoutUserInput = {
    where: ErrorLogWhereUniqueInput
    create: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput>
  }

  export type ErrorLogCreateManyUserInputEnvelope = {
    data: ErrorLogCreateManyUserInput | ErrorLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TemporaryAccessCreateWithoutUserInput = {
    id?: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemporaryAccessUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemporaryAccessCreateOrConnectWithoutUserInput = {
    where: TemporaryAccessWhereUniqueInput
    create: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput>
  }

  export type TemporaryAccessCreateManyUserInputEnvelope = {
    data: TemporaryAccessCreateManyUserInput | TemporaryAccessCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CVUpsertWithWhereUniqueWithoutUserInput = {
    where: CVWhereUniqueInput
    update: XOR<CVUpdateWithoutUserInput, CVUncheckedUpdateWithoutUserInput>
    create: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput>
  }

  export type CVUpdateWithWhereUniqueWithoutUserInput = {
    where: CVWhereUniqueInput
    data: XOR<CVUpdateWithoutUserInput, CVUncheckedUpdateWithoutUserInput>
  }

  export type CVUpdateManyWithWhereWithoutUserInput = {
    where: CVScalarWhereInput
    data: XOR<CVUpdateManyMutationInput, CVUncheckedUpdateManyWithoutUserInput>
  }

  export type CVScalarWhereInput = {
    AND?: CVScalarWhereInput | CVScalarWhereInput[]
    OR?: CVScalarWhereInput[]
    NOT?: CVScalarWhereInput | CVScalarWhereInput[]
    id?: StringFilter<"CV"> | string
    title?: StringFilter<"CV"> | string
    content?: StringFilter<"CV"> | string
    createdAt?: DateTimeFilter<"CV"> | Date | string
    updatedAt?: DateTimeFilter<"CV"> | Date | string
    userId?: StringFilter<"CV"> | string
    atsScore?: IntNullableFilter<"CV"> | number | null
    isPublic?: BoolFilter<"CV"> | boolean
    publishedAt?: DateTimeNullableFilter<"CV"> | Date | string | null
  }

  export type PaymentUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithWhereWithoutUserInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutUserInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    userId?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    stripePaymentId?: StringFilter<"Payment"> | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    canceledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    stripeCustomerId?: StringFilter<"Subscription"> | string
    stripePriceId?: StringFilter<"Subscription"> | string
    stripeSubscriptionId?: StringFilter<"Subscription"> | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type PageViewUpsertWithWhereUniqueWithoutUserInput = {
    where: PageViewWhereUniqueInput
    update: XOR<PageViewUpdateWithoutUserInput, PageViewUncheckedUpdateWithoutUserInput>
    create: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput>
  }

  export type PageViewUpdateWithWhereUniqueWithoutUserInput = {
    where: PageViewWhereUniqueInput
    data: XOR<PageViewUpdateWithoutUserInput, PageViewUncheckedUpdateWithoutUserInput>
  }

  export type PageViewUpdateManyWithWhereWithoutUserInput = {
    where: PageViewScalarWhereInput
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyWithoutUserInput>
  }

  export type PageViewScalarWhereInput = {
    AND?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
    OR?: PageViewScalarWhereInput[]
    NOT?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
    id?: StringFilter<"PageView"> | string
    url?: StringFilter<"PageView"> | string
    userId?: StringNullableFilter<"PageView"> | string | null
    timestamp?: DateTimeFilter<"PageView"> | Date | string
    userAgent?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
  }

  export type ErrorLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ErrorLogWhereUniqueInput
    update: XOR<ErrorLogUpdateWithoutUserInput, ErrorLogUncheckedUpdateWithoutUserInput>
    create: XOR<ErrorLogCreateWithoutUserInput, ErrorLogUncheckedCreateWithoutUserInput>
  }

  export type ErrorLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ErrorLogWhereUniqueInput
    data: XOR<ErrorLogUpdateWithoutUserInput, ErrorLogUncheckedUpdateWithoutUserInput>
  }

  export type ErrorLogUpdateManyWithWhereWithoutUserInput = {
    where: ErrorLogScalarWhereInput
    data: XOR<ErrorLogUpdateManyMutationInput, ErrorLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ErrorLogScalarWhereInput = {
    AND?: ErrorLogScalarWhereInput | ErrorLogScalarWhereInput[]
    OR?: ErrorLogScalarWhereInput[]
    NOT?: ErrorLogScalarWhereInput | ErrorLogScalarWhereInput[]
    id?: StringFilter<"ErrorLog"> | string
    name?: StringFilter<"ErrorLog"> | string
    message?: StringFilter<"ErrorLog"> | string
    stack?: StringNullableFilter<"ErrorLog"> | string | null
    code?: StringNullableFilter<"ErrorLog"> | string | null
    userId?: StringNullableFilter<"ErrorLog"> | string | null
    timestamp?: DateTimeFilter<"ErrorLog"> | Date | string
    url?: StringNullableFilter<"ErrorLog"> | string | null
    method?: StringNullableFilter<"ErrorLog"> | string | null
  }

  export type TemporaryAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: TemporaryAccessWhereUniqueInput
    update: XOR<TemporaryAccessUpdateWithoutUserInput, TemporaryAccessUncheckedUpdateWithoutUserInput>
    create: XOR<TemporaryAccessCreateWithoutUserInput, TemporaryAccessUncheckedCreateWithoutUserInput>
  }

  export type TemporaryAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: TemporaryAccessWhereUniqueInput
    data: XOR<TemporaryAccessUpdateWithoutUserInput, TemporaryAccessUncheckedUpdateWithoutUserInput>
  }

  export type TemporaryAccessUpdateManyWithWhereWithoutUserInput = {
    where: TemporaryAccessScalarWhereInput
    data: XOR<TemporaryAccessUpdateManyMutationInput, TemporaryAccessUncheckedUpdateManyWithoutUserInput>
  }

  export type TemporaryAccessScalarWhereInput = {
    AND?: TemporaryAccessScalarWhereInput | TemporaryAccessScalarWhereInput[]
    OR?: TemporaryAccessScalarWhereInput[]
    NOT?: TemporaryAccessScalarWhereInput | TemporaryAccessScalarWhereInput[]
    id?: StringFilter<"TemporaryAccess"> | string
    userId?: StringFilter<"TemporaryAccess"> | string
    type?: StringFilter<"TemporaryAccess"> | string
    startTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    endTime?: DateTimeFilter<"TemporaryAccess"> | Date | string
    createdAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
    updatedAt?: DateTimeFilter<"TemporaryAccess"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPageViewsInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPageViewsInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPageViewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
  }

  export type UserUpsertWithoutPageViewsInput = {
    update: XOR<UserUpdateWithoutPageViewsInput, UserUncheckedUpdateWithoutPageViewsInput>
    create: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPageViewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPageViewsInput, UserUncheckedUpdateWithoutPageViewsInput>
  }

  export type UserUpdateWithoutPageViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPageViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutErrorLogsInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutErrorLogsInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    temporaryAccess?: TemporaryAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutErrorLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutErrorLogsInput, UserUncheckedCreateWithoutErrorLogsInput>
  }

  export type UserUpsertWithoutErrorLogsInput = {
    update: XOR<UserUpdateWithoutErrorLogsInput, UserUncheckedUpdateWithoutErrorLogsInput>
    create: XOR<UserCreateWithoutErrorLogsInput, UserUncheckedCreateWithoutErrorLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutErrorLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutErrorLogsInput, UserUncheckedUpdateWithoutErrorLogsInput>
  }

  export type UserUpdateWithoutErrorLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutErrorLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    temporaryAccess?: TemporaryAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTemporaryAccessInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVCreateNestedManyWithoutUserInput
    Payment?: PaymentCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    PageViews?: PageViewCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTemporaryAccessInput = {
    id: string
    email: string
    password: string
    name: string
    customerId?: string | null
    twoFactorSecret?: string | null
    twoFactorEnabled?: boolean
    backupCodes?: UserCreatebackupCodesInput | string[]
    marketingConsent?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    failedLoginAttempts?: number
    lastLogin?: Date | string | null
    lockedUntil?: Date | string | null
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    CV?: CVUncheckedCreateNestedManyWithoutUserInput
    Payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    Subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    PageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    ErrorLogs?: ErrorLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTemporaryAccessInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTemporaryAccessInput, UserUncheckedCreateWithoutTemporaryAccessInput>
  }

  export type UserUpsertWithoutTemporaryAccessInput = {
    update: XOR<UserUpdateWithoutTemporaryAccessInput, UserUncheckedUpdateWithoutTemporaryAccessInput>
    create: XOR<UserCreateWithoutTemporaryAccessInput, UserUncheckedCreateWithoutTemporaryAccessInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTemporaryAccessInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTemporaryAccessInput, UserUncheckedUpdateWithoutTemporaryAccessInput>
  }

  export type UserUpdateWithoutTemporaryAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUpdateManyWithoutUserNestedInput
    Payment?: PaymentUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTemporaryAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorSecret?: NullableStringFieldUpdateOperationsInput | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    backupCodes?: UserUpdatebackupCodesInput | string[]
    marketingConsent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CV?: CVUncheckedUpdateManyWithoutUserNestedInput
    Payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    Subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    PageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    ErrorLogs?: ErrorLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CVSectionCreateManyCVInput = {
    id: string
    title: string
    content: string
    order: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type CVSectionUpdateWithoutCVInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CVSectionUncheckedUpdateWithoutCVInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CVSectionUncheckedUpdateManyWithoutCVInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CVCreateManyUserInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    atsScore?: number | null
    isPublic?: boolean
    publishedAt?: Date | string | null
  }

  export type PaymentCreateManyUserInput = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt?: Date | string
    stripePaymentId: string
  }

  export type SubscriptionCreateManyUserInput = {
    id: string
    status: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    stripeCustomerId: string
    stripePriceId: string
    stripeSubscriptionId: string
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PageViewCreateManyUserInput = {
    id?: string
    url: string
    timestamp?: Date | string
    userAgent?: string | null
    referrer?: string | null
  }

  export type ErrorLogCreateManyUserInput = {
    id?: string
    name: string
    message: string
    stack?: string | null
    code?: string | null
    timestamp?: Date | string
    url?: string | null
    method?: string | null
  }

  export type TemporaryAccessCreateManyUserInput = {
    id?: string
    type: string
    startTime?: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CVUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CVSection?: CVSectionUpdateManyWithoutCVNestedInput
  }

  export type CVUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    CVSection?: CVSectionUncheckedUpdateManyWithoutCVNestedInput
  }

  export type CVUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    atsScore?: NullableIntFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PageViewUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PageViewUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ErrorLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TemporaryAccessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemporaryAccessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemporaryAccessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}