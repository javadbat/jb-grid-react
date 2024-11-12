import { observer } from 'mobx-react';
import React, { LegacyRef, useMemo } from 'react';
import JBGridViewModel from './JBGridViewModel.js';
type FooterProps = {
    vm:JBGridViewModel<any>,
    isFullscreen:boolean
}
function Footer(props:FooterProps) {
  const {vm,isFullscreen} = props;
  return (
    <section key={'jb-grid-footer'} className="jb-grid-footer">
      <section className="btn-wrapper-section">
        {
          isFullscreen !== null && isFullscreen !== undefined && (
            <div className="btn full-screen-button" onClick={() => vm.onFullScreenBtnClicked(isFullscreen)}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" x="0px" y="0px" viewBox="0 0 128 128" className={isFullscreen ? 'exit-full-screen-svg' : 'full-screen-svg'}>
                <g className="arrow" transform={!isFullscreen ? '' : "translate(0, 0) rotate(180 30 30)"}>
                  <path d="M47.979,41.795L26.466,20.292c-3.995-6.034,6.546-6.069,6.546-6.069h6.385c4.054-0.105,6.282-2.363,6.24-5.229   c-0.041-2.866-1.591-5.216-5.167-5.151H23.679C-0.4,2.575,0.342,20.363,0.755,24.486c0.02,0.208-0.015,0.375,0,0.502v0.025   l0.011,15.21c-0.029,2.556,1.211,5.834,4.501,6.265c3.329,0.434,6.025-2.22,6.06-4.774v-9.788v0.084   c-0.062-7.879,5.311-3.858,5.311-3.858l23.346,22.95c1.842,1.843,6.8,3.308,9.362,0.711C53.583,47.516,49.821,43.637,47.979,41.795   z"></path>
                  <path d="M0.755,26.555c0,0,0.024-0.099,0-0.277v-0.004V26.555z"></path>
                </g>
                <g className="arrow" transform={!isFullscreen ? '' : "translate(0, 0) rotate(180 100 30)"}>
                  <path d="M89.483,50.518l21.504-21.512c6.034-3.995,6.07,6.546,6.07,6.546v6.385c0.104,4.055,2.361,6.281,5.228,6.24   c2.867-0.04,5.217-1.59,5.152-5.167V26.219c1.266-24.08-16.521-23.337-20.645-22.924c-0.206,0.02-0.374-0.015-0.503,0h-0.024   l-15.21,0.011c-2.557-0.029-5.834,1.211-6.265,4.501c-0.436,3.329,2.219,6.025,4.773,6.06h9.789H99.27   c7.879-0.062,3.858,5.311,3.858,5.311L80.177,42.524c-1.842,1.842-3.309,6.801-0.711,9.363   C83.764,56.123,87.642,52.362,89.483,50.518z"></path>
                  <path d="M104.723,3.294c0,0,0.101,0.024,0.279,0h0.003H104.723z"></path>
                </g>
                <g className="arrow" transform={!isFullscreen ? '' : "translate(0, 0) rotate(180 100 100)"}>
                  <path d="M80.759,88.376l21.514,21.505c3.995,6.035-6.546,6.068-6.546,6.068H89.34c-4.054,0.106-6.282,2.364-6.24,5.23   c0.041,2.863,1.591,5.214,5.167,5.149h16.792c24.08,1.269,23.337-16.521,22.924-20.642c-0.02-0.21,0.017-0.377,0-0.503v-0.025   l-0.012-15.21c0.031-2.557-1.209-5.834-4.501-6.265c-3.327-0.436-6.023,2.219-6.06,4.772v9.79v-0.084   c0.062,7.879-5.312,3.856-5.312,3.856L88.753,79.068c-1.843-1.841-6.8-3.308-9.362-0.709   C75.153,82.656,78.916,86.534,80.759,88.376z"></path>
                  <path d="M127.982,103.617c0,0-0.022,0.098,0,0.276v0.006V103.617z"></path>
                </g>
                <g className="arrow" transform={!isFullscreen ? '' : "translate(0, 0) rotate(180 30 100)"}>
                  <path d="M43.481,79.65l-21.503,21.514c-6.035,3.995-6.07-6.547-6.07-6.547v-6.384c-0.104-4.054-2.362-6.283-5.229-6.241   c-2.865,0.041-5.215,1.592-5.151,5.168v16.792c-1.267,24.078,16.521,23.338,20.643,22.924c0.208-0.02,0.375,0.015,0.503,0h0.025   l15.21-0.011c2.557,0.028,5.833-1.213,6.264-4.501c0.436-3.33-2.219-6.026-4.773-6.06h-9.789h0.084   c-7.879,0.062-3.857-5.312-3.857-5.312l22.949-23.347c1.843-1.844,3.31-6.8,0.711-9.363C49.201,74.045,45.323,77.809,43.481,79.65z   "></path>
                  <path d="M28.242,126.876c0,0-0.1-0.024-0.278,0h-0.004H28.242z"></path>
                </g>
              </svg>
            </div>
          )}
        <div className="btn refresh-btn" onClick={() => vm.refreshBtnClick()}>
          <svg id="Capa_1" x="0px" y="0px" viewBox="0 0 305.836 305.836" ref={vm.elements.refreshIcon as LegacyRef<SVGSVGElement>}>
            <g>
              <path d="M152.924,300.748c84.319,0,152.912-68.6,152.912-152.918c0-39.476-15.312-77.231-42.346-105.564   c0,0,3.938-8.857,8.814-19.783c4.864-10.926-2.138-18.636-15.648-17.228l-79.125,8.289c-13.511,1.411-17.999,11.467-10.021,22.461   l46.741,64.393c7.986,10.992,17.834,12.31,22.008,2.937l7.56-16.964c12.172,18.012,18.976,39.329,18.976,61.459   c0,60.594-49.288,109.875-109.87,109.875c-60.591,0-109.882-49.287-109.882-109.875c0-19.086,4.96-37.878,14.357-54.337   c5.891-10.325,2.3-23.467-8.025-29.357c-10.328-5.896-23.464-2.3-29.36,8.031C6.923,95.107,0,121.27,0,147.829   C0,232.148,68.602,300.748,152.924,300.748z" />
            </g>
          </svg>
        </div>
      </section>
      <section className="page-section">
        <section className="page-size-section" title={vm.i18n.messages.pageItemCount}>
          <select value={vm.config.page.size} className="page-size-select" onChange={(e) => vm.onPageSizeChange(e)}>
            <option value={20}>{vm.paginationDisplayNumbers.pageSizes[0]}</option>
            <option value={30}>{vm.paginationDisplayNumbers.pageSizes[1]}</option>
            <option value={50}>{vm.paginationDisplayNumbers.pageSizes[2]}</option>
            <option value={100}>{vm.paginationDisplayNumbers.pageSizes[3]}</option>
          </select>
        </section>
        <section className="items-information-section">
          <span>{vm.paginationDisplayNumbers.startItemIndex}</span>
          <span>-</span>
          <span> {vm.paginationDisplayNumbers.endItemIndex} </span>
          <span> &nbsp;{vm.i18n.messages.from}</span>
          <span title={vm.i18n.messages.currentAvailableItem}>&nbsp; {vm.paginationDisplayNumbers.totalItemsCount} &nbsp;</span>

        </section>
        <section className="navigation-section nav-btn">
          <nav>
            <div className="last-Page-btn nav-btn" title={vm.config.page.totalPages.toString()} onClick={() => vm.goToLastPage()}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d="M15 6 v12 h2 v-12 h-2z M8 6L6.59 7.41 11.17 12l-4.58 4.59L8 18l6-6z"></path></svg>

            </div>
            <div className="next-Page-btn nav-btn" onClick={() => vm.goToNextPage()}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>

            </div>
            <div className="number-container">
              <div className="number-wrapper">
                <div className="number-btn" onClick={() => vm.goToPage(vm.config.page.index + 2)}>{vm.paginationDisplayNumbers.next2Page}</div>
                <div className="number-btn" onClick={() => vm.goToPage(vm.config.page.index + 1)}>{vm.paginationDisplayNumbers.nextPage}</div>
                <div className="number-btn current-page" onClick={() => vm.changePageNumberToInput()}>{vm.paginationDisplayNumbers.currentPage}</div>
                <div className="number-btn" onClick={() => vm.goToPage(vm.config.page.index - 1)}>{vm.paginationDisplayNumbers.prevPage}</div>
                <div className="number-btn" onClick={() => vm.goToPage(vm.config.page.index - 2)}>{vm.paginationDisplayNumbers.prev2Page}</div>
              </div>
            </div>
            <div className="prev-Page-btn nav-btn" onClick={() => vm.goToPrevPage()}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
            </div>
            <div className="first-Page-btn nav-btn" onClick={() => vm.goToFirstPage()}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d="M7 6 v12 h2 v-12 h-2z M17.41 7.41L16 6l-6 6 6 6 1.41-1.41L12.83 12z"></path></svg>

            </div>
          </nav>
        </section>
      </section>

    </section>
  );
}

export default observer(Footer) ;