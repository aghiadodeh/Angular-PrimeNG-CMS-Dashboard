import { BehaviorSubject } from "rxjs";

interface IResult<T> {
  loading?: boolean;
  data?: T;
}

export class Result<T> {
  public loading$: BehaviorSubject<boolean>;
  public data$: BehaviorSubject<T | undefined>;

  constructor(props: IResult<T> = {}) {
    this.loading$ = new BehaviorSubject(props.loading ?? false);
    this.data$ = new BehaviorSubject(props.data);
  }

  public setData(data: T): void {
    this.data$.next(data);
    this.loading$.next(false);
  }

  public setLoading(loading: boolean): void {
    this.loading$.next(loading);
  }
}

export class LoadingResult<T> extends Result<T> {
  constructor() {
    super({ loading: true });
  }
}

export class DataResult<T> extends Result<T> {
  constructor(data: T) {
    super({ data: data });
  }
}
