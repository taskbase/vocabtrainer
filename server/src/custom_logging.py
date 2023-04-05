import logging


def setup_logging():
    # OPTIMIZE: this will result in different indents for different log levels, but avoiding this is tricky
    log_format = "%(levelname)s:     %(message)s"
    logging.basicConfig(level=logging.INFO, format=log_format)
